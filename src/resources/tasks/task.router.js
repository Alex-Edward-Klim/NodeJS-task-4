const router = require('express').Router({ mergeParams: true });
const Task = require('./task.model');
const tasksService = require('./task.service');

router.route('/').get(async (req, res) => {
  const tasks = await tasksService.getAll();
  res.json(tasks.filter(elem => elem.boardId === req.params.boardId));
});

router.route('/:taskId').get(async (req, res) => {
  const tasks = await tasksService.getAll();
  const task = tasks.find(
    elem => elem.id === req.params.taskId && elem.boardId === req.params.boardId
  );

  if (!task) {
    res
      .status(404)
      .send(`The task with the ID: ${req.params.taskId} was NOT found`);
  } else {
    res.json(task);
  }
});

router.route('/').post(async (req, res) => {
  const tasks = await tasksService.getAll();
  const task = new Task(req.body);
  tasks.push(Object.assign(task, { boardId: req.params.boardId }));
  res.json(task);
});

router.route('/:taskId').put(async (req, res) => {
  const tasks = await tasksService.getAll();
  const task = tasks.find(
    elem => elem.id === req.params.taskId && elem.boardId === req.params.boardId
  );

  if (!task) {
    res
      .status(404)
      .send(`The task with the ID: ${req.params.taskId} was NOT found`);
  } else {
    res.json(Object.assign(task, req.body));
  }
});

router.route('/:taskId').delete(async (req, res) => {
  const tasks = await tasksService.getAll();
  const taskIndex = tasks.findIndex(elem => elem.id === req.params.taskId);

  if (taskIndex === -1) {
    res
      .status(404)
      .send(`The board with the ID: ${req.params.taskId} was NOT found`);
  } else {
    const task = tasks.splice(taskIndex, 1);
    res.json(task);
  }
});

module.exports = router;
