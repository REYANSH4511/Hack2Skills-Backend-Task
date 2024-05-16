const User = require("../models/user.model");
const { successHandler, errorHandler } = require("../utils/responseHandler");
const getMessage = require("../utils/message");
const { ObjectId } = require("mongodb");

exports.createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const checkUserAlreadyExists = await User.findOne({ email });
    if (checkUserAlreadyExists) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M002"),
      });
    }
    const user = await User.create({ name, email });
    if (!user || user == null) {
      {
        return errorHandler({
          res,
          statusCode: 400,
          message: getMessage("M003"),
        });
      }
    }
    let userData = user.toObject();
    delete userData.tasks;
    return successHandler({
      res,
      data: userData,
      statusCode: 201,
      message: getMessage("M001"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};
exports.addTask = async (req, res) => {
  const { subject, deadline, status } = req.body;
  const addTaskBody = {};
  if (subject !== undefined) addTaskBody.subject = subject;
  if (deadline !== undefined) addTaskBody.deadline = deadline;
  if (status !== undefined) addTaskBody.status = status;
  const userId = new ObjectId(req.params.userId);

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { tasks: addTaskBody } },
      { new: true }
    );

    if (!updatedUser) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M007"),
      });
    }

    const newTaskIndex = updatedUser.tasks.length - 1;
    const newTaskId = updatedUser.tasks[newTaskIndex]._id;

    const taskData = updatedUser.tasks.find((task) =>
      task._id.equals(newTaskId)
    );

    return successHandler({
      res,
      data: taskData,
      statusCode: 200,
      message: getMessage("M004"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};
exports.updateTask = async (req, res) => {
  const { subject, deadline, status } = req.body;
  const taskId = req.params.taskId;
  try {
    const user = await User.findOne({ "tasks._id": taskId }, { tasks: 1 });

    if (!user) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M008"),
      });
    }
    let updatedTask = null;
    for (const task of user.tasks) {
      if (task._id.toString() == taskId) {
        task.subject = subject;
        task.deadline = deadline;
        task.status = status;
        updatedTask = task;
        break;
      }
    }

    if (updatedTask) {
      user.markModified("tasks");
      await user.save();
    }

    return successHandler({
      res,
      data: updatedTask,
      statusCode: 200,
      message: getMessage("M005"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};
exports.deleteTask = async (req, res) => {
  const taskId = new ObjectId(req.params.taskId);
  try {
    const updatedUser = await User.findOneAndUpdate(
      { "tasks._id": taskId },
      {
        $set: { "tasks.$.isActive": false },
      },
      { new: true }
    );

    if (!updatedUser) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M008"),
      });
    }

    return successHandler({
      res,
      data: {},
      statusCode: 200,
      message: getMessage("M006"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};
exports.getTasks = async (req, res) => {
  const userId = new ObjectId(req.params.userId);
  try {
    const tasks = await User.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $addFields: {
          tasks: {
            $filter: {
              input: "$tasks",
              as: "task",
              cond: {
                $eq: ["$$task.isActive", true],
              },
            },
          },
        },
      },
      {
        $addFields: {
          finalData: {
            $map: {
              input: "$tasks",
              as: "task",
              in: {
                _id: "$$task._id",
                subject: "$$task.subject",
                status: "$$task.status",
                isActive: "$$task.isActive",
                deadline: "$$task.deadline",
                subTasks: {
                  $filter: {
                    input: "$$task.subTasks",
                    as: "sub",
                    cond: {
                      $eq: ["$$sub.isActive", true],
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    if (tasks.length === 0) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M008"),
      });
    }
    return successHandler({
      res,
      data: tasks[0]?.finalData,
      statusCode: 200,
      message: getMessage("M009"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

exports.updateSubTaks = async (req, res) => {
  const { subTasks } = req.body;
  const taskId = req.params.taskId;
  try {
    const user = await User.findOne(
      { "tasks._id": taskId },
      {
        tasks: 1,
      }
    );
    const mergedArray = [];
    if (user && user.tasks) {
      for (let task of user.tasks) {
        if (task._id.toString() === taskId) {
          subTasks.forEach((obj2) => {
            const existingIndex = mergedArray.findIndex(
              (obj1) => obj1._id === obj2._id
            );
            if (existingIndex !== -1) {
              mergedArray[existingIndex] = obj2;
            } else {
              mergedArray.push(obj2);
            }
          });

          task.subTasks.forEach((obj1) => {
            const existingIndex = mergedArray.findIndex(
              (obj) => obj._id === obj1._id.toString()
            );
            if (existingIndex === -1) {
              mergedArray.push(obj1);
            }
          });
          task.subTasks = mergedArray;
          break;
        }
      }
      if (mergedArray.length) {
        user.markModified("tasks");
        user.save();
      }
    }

    return successHandler({
      res,
      data: { mergedArray },
      statusCode: 200,
      message: getMessage("M011"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};

exports.listSubtasks = async (req, res) => {
  const taskId = new ObjectId(req.params.taskId);
  try {
    const taskList = await User.aggregate([
      {
        $match: {
          "tasks._id": taskId,
        },
      },
      {
        $unwind: {
          path: "$tasks",
        },
      },
      {
        $match: {
          "tasks._id": taskId,
        },
      },
      {
        $project: {
          subTask: {
            $filter: {
              input: "$tasks.subTasks",
              as: "sub",
              cond: {
                $eq: ["$$sub.isActive", true],
              },
            },
          },
        },
      },
    ]);

    if (taskList[0]?.subTask.length === 0) {
      return errorHandler({
        res,
        statusCode: 400,
        message: getMessage("M008"),
      });
    }
    return successHandler({
      res,
      data: taskList[0]?.subTask,
      statusCode: 200,
      message: getMessage("M014"),
    });
  } catch (err) {
    return errorHandler({
      res,
      statusCode: 500,
      message: err.message,
    });
  }
};
