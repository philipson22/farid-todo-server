const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const Task = mongoose.model("task", {
  title: String,
  isDone: {
    type: Boolean,
    default: false
  }
});

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/todo-app",
  { useNewUrlParser: true }
);

app.get("/", (req, res) => {
  Task.find().exec((err, tasks) => {
    if (err) {
      return res.status(400).json({ error: "An error occurred" });
    }
    return res.json(tasks);
  });
});

app.post("/create", (req, res) => {
  const task = new Task({ title: req.body.title });
  task.save(err => {
    if (err) {
      return res.status(400).json({ error: "An error occurred" });
    }
    return res.json(task);
  });
});

app.post("/update", (req, res) => {
  if (req.body.id) {
    Task.findById(req.body.id).exec((err, task) => {
      if (err) {
        return res.status(400).json({ error: "An error occurred" });
      }
      task.isDone = !task.isDone;
      task.save(err => {
        return res.json({ message: "Task has been updated" });
      });
    });
  } else {
    return res.status(400).json({ error: "`id` is missing" });
  }
});

app.post("/delete", (req, res) => {
  if (req.body.id) {
    Task.deleteOne({ _id: req.body.id }).exec((err, task) => {
      if (err) {
        return res.status(400).json({ error: "An error occurred" });
      }
      return res.json({ message: "Task has been deleted" });
    });
  } else {
    return res.status(400).json({ error: "`id` is missing" });
  }
});

app.listen(process.env.PORT || 3100, () => {
  console.log("Server started");
});
