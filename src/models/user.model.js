const { Schema, model } = require("mongoose");

const subTasksSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const tasksSchema = new Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Completed"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    subTasks: [subTasksSchema],
  },
  {
    timestamps: true,
  }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tasks: [tasksSchema],
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
