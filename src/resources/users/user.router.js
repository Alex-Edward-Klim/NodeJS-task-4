const router = require('express').Router();
const User = require('./user.model');
const usersService = require('./user.service');

const tasksService = require('../tasks/task.service');

router.route('/').get(async (req, res) => {
  const users = await usersService.getAll();
  // map user fields to exclude secret fields like "password"
  res.json(users.map(User.toResponse));
});

router.route('/:userId').get(async (req, res) => {
  const users = await usersService.getAll();
  const user = users.find(elem => elem.id === req.params.userId);

  if (!user) {
    res
      .status(404)
      .send(`The user with the ID: ${req.params.userId} was NOT found`);
  } else {
    res.json(User.toResponse(user));
  }
});

router.route('/').post(async (req, res) => {
  const users = await usersService.getAll();
  const user = new User(req.body);
  users.push(user);
  res.json(User.toResponse(user));
});

router.route('/:userId').put(async (req, res) => {
  const users = await usersService.getAll();
  const user = users.find(elem => elem.id === req.params.userId);

  if (!user) {
    res
      .status(404)
      .send(`The user with the ID: ${req.params.userId} was NOT found`);
  } else {
    res.json(User.toResponse(Object.assign(user, req.body)));
  }
});

router.route('/:userId').delete(async (req, res) => {
  const users = await usersService.getAll();
  const userIndex = users.findIndex(elem => elem.id === req.params.userId);

  if (userIndex === -1) {
    res
      .status(404)
      .send(`The user with the ID: ${req.params.userId} was NOT found`);
  } else {
    const user = users.splice(userIndex, 1)[0];

    const tasks = await tasksService.getAll();
    tasks.map(elem => {
      if (elem.userId === user.id) {
        elem.userId = null;
      }
    });

    res.json(User.toResponse(user));
  }
});

module.exports = router;
