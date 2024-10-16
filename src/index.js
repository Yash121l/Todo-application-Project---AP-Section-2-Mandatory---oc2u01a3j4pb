const express = require("express");
const bodyParser = require("body-parser");
const { prisma } = require("../db/config");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.get("/", (_, res) => {
  res.send("hello world");
});

app.post("/create", async (req, res) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  try {
    const newTodo = await prisma.todos.create({
      data: {
        task,
      },
    });

    return res.status(201).json({ id: newTodo.id, message: "Todo is created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getAll", async (req, res) => {
  try {
    const todos = await prisma.todos.findMany()
    return res.status(200).json({ "todos": todos })
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
})

app.patch("/update/:id", async (req, res) => {
  const id = req.params.id
  const { task, completed } = req.body
  if (!task && !completed) res.status(404).json({ "message": "No fields provided to update" })
  try {
    const todo = await prisma.todos.findUnique({
      where: { id: parseInt(id) }
    })
    if (!todo) res.status(404).json({ "message": "Todo not found" })

      const todos = await prisma.todos.update({
        where: {
          id: parseInt(id)
        },
        data: 
          req.body
        
      })
      return res.status(200).json({ "message": "Todo is updated", "todos": todos })
  } catch (err) {
    console.log(err)
    return res.status(500).send("Internal Server Erroe")
  }

})

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id
  try {
    const todo = await prisma.todos.findUnique({
      where: { id: parseInt(id) }
    })
    if (!todo) res.status(404).json({ "message": "Todo not found" })
    if (todo) {
      await prisma.todos.delete({
        where: { id: parseInt(id) }
      })
      res.status(200).json({ "message": "Todo is Deleted" })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send("Internal Server Erroe")
  }

})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
