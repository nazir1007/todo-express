const mongoose = require("mongoose");
const mongo = () => {
  mongoose.connect("mongodb://localhost:27017/todo");
  mongoose.connection.once("open", () => console.log("mongoDb is connected"));
  mongoose.connection.on("error", () => console.log("Error in mongo"));
};

const task = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: Boolean, default: false },
});

const taskModel = mongoose.model("task", task);

const express = require("express");
const http = require("http");
const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  let response = await taskModel.find({});
  res.json(response);
});

app.post("/", async (req, res) => {
  let response = await taskModel.create(req.body);
  res.json(response);
});

app.patch("/:id", async (req, res) => {
  let response = await taskModel.updateOne(
    { _id: req.params.id },
    { $set: { status: req.body.status } }
  );
  res.json(response);
});

app.delete("/:id", async (req, res) => {
  let response = await taskModel.deleteOne({ _id: req.params.id });
  res.json(response);
});

http.createServer(app).listen(5000, () => {
  mongo();
  console.log("listening on 5000");
});
