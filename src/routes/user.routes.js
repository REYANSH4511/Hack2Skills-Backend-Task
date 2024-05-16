const express = require("express");
const router = express.Router();
const {
  createUser,
  addTask,
  updateTask,
  deleteTask,
  getTasks,
  updateSubTaks,
  listSubtasks,
} = require("../controllers/user.controller.js");
const Validators = require("../validator/validators");
/**
 * @swagger
 * /api/v1/users/create-user:
 *   post:
 *     summary: Create a new user.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - name
 *               - email
 *     responses:
 *       '201':
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msgCode:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 example:
 *                   statusCode: 201
 *                   status: "success"
 *                   msg: "User created successfully!"
 *                   data:
 *                     name: "Reyansh Joshi"
 *                     email: "reyanshjoshi@gmail.com"
 *       '400':
 *         description: User with provided email already exists!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 400
 *                 status: "error"
 *                 msgCode: "400"
 *                 msg: "User with provided email already exists!"
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 500
 *                 status: "error"
 *                 msgCode: "500"
 *                 msg: "Internal server error."
 */
router.route("/create-user").post(Validators("validUsers"), createUser);

/**
 * @swagger
 * /api/v1/users/add-task/{userId}:
 *   post:
 *     summary: Add a task for a user.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to add the task for.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [Pending, Completed]
 *             required:
 *               - subject
 *               - deadline
 *     responses:
 *       '201':
 *         description: Task added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     subject:
 *                       type: string
 *                     deadline:
 *                       type: string
 *                       format: date
 *                     status:
 *                       type: string
 *                 example:
 *                   statusCode: 200
 *                   status: "success"
 *                   msg: "Task added successfully."
 *                   data:
 *                     _id: "609d0c67415a2e4cf61b75e8"
 *                     subject: "Complete project report"
 *                     deadline: "2024-05-30"
 *                     status: "Pending"
 *       '400':
 *         description: User not found!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 400
 *                 status: "error"
 *                 msgCode: "400"
 *                 msg: "User not found!"
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 500
 *                 status: "error"
 *                 msgCode: "500"
 *                 msg: "Internal server error."
 */

router.route("/add-task/:userId").post(Validators("validTask"), addTask);

/**
 * @swagger
 * /api/v1/users/update-task/{taskId}:
 *   put:
 *     summary: Update a task for a user.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: ID of the task to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               deadline:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *             required:
 *               - subject
 *               - deadline
 *               - status
 *     responses:
 *       '200':
 *         description: Task updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     subject:
 *                       type: string
 *                     deadline:
 *                       type: string
 *                       format: date
 *                     status:
 *                       type: string
 *                 example:
 *                   statusCode: 200
 *                   status: "success"
 *                   msg: "Task updated successfully."
 *                   data:
 *                     _id: "609d0c67415a2e4cf61b75e8"
 *                     subject: "Complete project report"
 *                     deadline: "2024-05-30"
 *                     status: "Pending"
 *       '400':
 *         description: Bad request, invalid task details or task not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 400
 *                 status: "error"
 *                 msgCode: "400"
 *                 msg: "Invalid task details or task not found."
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 500
 *                 status: "error"
 *                 msgCode: "500"
 *                 msg: "Internal server error."
 */
router
  .route("/update-task/:taskId")
  .put(Validators("validUpdateTask"), updateTask);

/**
    * @swagger
    * /api/v1/users/delete-task/{taskId}:
    *   delete:
    *     summary: Delete a task for a user.
    *     tags: [Users]
    *     parameters:
    *       - in: path
    *         name: taskId
    *         required: true
    *         description: ID of the task to delete.
    *         schema:
    *           type: string
    *     responses:
    *       '200':
    *         description: Task deleted successfully.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 statusCode:
    *                   type: number
    *                 status:
    *                   type: string
    *                 msg:
    *                   type: string
    *               example:
    *                 statusCode: 200
    *                 status: "success"
    *                 msgCode: "200"
    *                 msg: "Task deleted successfully."
    *       '400':
    *         description: Bad request, task not found.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 statusCode:
    *                   type: number
    *                 status:
    *                   type: string
    *                 msg:
    *                   type: string
    *               example:
    *                 statusCode: 400
    *                 status: "error"
    *                 msgCode: "400"
    *                 msg: "Task not found."
    *       '500':
    *         description: Internal server error.
    *         content:
    *           application/json:
    *             schema:
    *               type: object
    *               properties:
    *                 statusCode:
    *                   type: number
    *                 status:
    *                   type: string
    *                 msgCode:
    *                   type: string
    *                 msg:
    *                   type: string
    *               example:
    *                 statusCode: 500
    *                 status: "error"
    *                 msgCode: "500"
    *                 msg: "Internal server error."

 */

router.route("/delete-task/:taskId").delete(deleteTask);

/**
 * @swagger
 * /api/v1/users/get-tasks/{userId}:
 *   get:
 *     summary: Get tasks for a user.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to get tasks for.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tasks fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       subject:
 *                         type: string
 *                       status:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 *                       deadline:
 *                         type: string
 *                         format: date
 *                       subTasks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             subject:
 *                               type: string
 *                             status:
 *                               type: string
 *                             isActive:
 *                               type: boolean
 *                             deadline:
 *                               type: string
 *                               format: date
 *                 example:
 *                   statusCode: 200
 *                   status: "success"
 *                   msgCode: "200"
 *                   msg: "Tasks list fetched successfully!"
 *                   data:
 *                     - _id: "609d0c67415a2e4cf61b75e8"
 *                       subject: "Complete project report"
 *                       status: "Pending"
 *                       isActive: true
 *                       deadline: "2024-05-30"
 *                       subTasks: []
 *       '400':
 *         description: Bad request, user not found or no tasks available for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msgCode:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 400
 *                 status: "error"
 *                 msgCode: "400"
 *                 msg: "User not found or no tasks available."
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msgCode:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 500
 *                 status: "error"
 *                 msgCode: "500"
 *                 msg: "Internal server error."
 */

router.route("/get-tasks/:userId").get(getTasks);

/**
 * @swagger
 * /api/v1/users/update-sub-tasks/{taskId}:
 *   put:
 *     summary: Update sub-tasks for a task.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: ID of the task to update sub-tasks for.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subTasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     subject:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Pending, Completed]
 *                     deadline:
 *                       type: string
 *                       format: date
 *                     isActive:
 *                       type: boolean
 *             required:
 *               - subTasks
 *     responses:
 *       '200':
 *         description: Sub-tasks updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msgCode:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       subject:
 *                         type: string
 *                       status:
 *                         type: string
 *                       deadline:
 *                         type: string
 *                         format: date
 *                       isActive:
 *                         type: boolean
 *                 example:
 *                   statusCode: 200
 *                   status: "success"
 *                   msgCode: "200"
 *                   msg: "Sub tasks updated successfully!"
 *                   data:
 *                     - _id: "609d0c67415a2e4cf61b75e8"
 *                       subject: "Complete sub-task 1"
 *                       status: "Pending"
 *                       deadline: "2024-05-30"
 *                       isActive: true
 *                     - _id: "609d0c67415a2e4cf61b75e9"
 *                       subject: "Complete sub-task 2"
 *                       status: "Completed"
 *                       deadline: "2024-06-15"
 *                       isActive: true
 *       '400':
 *         description: Bad request, task not found or no sub-tasks provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msgCode:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 400
 *                 status: "error"
 *                 msgCode: "400"
 *                 msg: "Task not found or no sub-tasks provided."
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msgCode:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 500
 *                 status: "error"
 *                 msgCode: "500"
 *                 msg: "Internal server error."
 */

router
  .route("/update-sub-tasks/:taskId")
  .put(Validators("validSubTask"), updateSubTaks);

/**
 * @swagger
 * /api/v1/users/list-sub-tasks/{taskId}:
 *   get:
 *     summary: Get list of sub-tasks for a task.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: ID of the task to get sub-tasks for.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Sub-tasks fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msgCode:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       subject:
 *                         type: string
 *                       status:
 *                         type: string
 *                       deadline:
 *                         type: string
 *                         format: date
 *                       isActive:
 *                         type: boolean
 *                 example:
 *                   statusCode: 200
 *                   status: "success"
 *                   msgCode: "200"
 *                   msg: "Sub tasks list fetched successfully!"
 *                   data:
 *                     - _id: "609d0c67415a2e4cf61b75e8"
 *                       subject: "Complete sub-task 1"
 *                       status: "Pending"
 *                       deadline: "2024-05-30"
 *                       isActive: true
 *                     - _id: "609d0c67415a2e4cf61b75e9"
 *                       subject: "Complete sub-task 2"
 *                       status: "Completed"
 *                       deadline: "2024-06-15"
 *                       isActive: true
 *       '400':
 *         description: Bad request, task not found or no sub-tasks available for the task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msgCode:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 400
 *                 status: "error"
 *                 msgCode: "400"
 *                 msg: "Task not found or no sub-tasks available."
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                 status:
 *                   type: string
 *                 msgCode:
 *                   type: string
 *                 msg:
 *                   type: string
 *               example:
 *                 statusCode: 500
 *                 status: "error"
 *                 msgCode: "500"
 *                 msg: "Internal server error."
 */

router.route("/list-sub-tasks/:taskId").get(listSubtasks);

module.exports = router;
