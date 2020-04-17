const router = require('express').Router();
const Board = require('./board.model');
const boardsService = require('./board.service');

const tasksService = require('../tasks/task.service');

router.route('/').get(async (req, res) => {
  const boards = await boardsService.getAll();
  res.json(boards);
});

router.route('/:boardId').get(async (req, res) => {
  const boards = await boardsService.getAll();
  const board = boards.find(elem => elem.id === req.params.boardId);

  if (!board) {
    res
      .status(404)
      .send(`The board with the ID: ${req.params.boardId} was NOT found`);
  } else {
    res.json(board);
  }
});

router.route('/').post(async (req, res) => {
  const boards = await boardsService.getAll();
  const board = new Board(req.body);
  boards.push(board);
  res.json(board);
});

router.route('/:boardId').put(async (req, res) => {
  const boards = await boardsService.getAll();
  const board = boards.find(elem => elem.id === req.params.boardId);

  if (!board) {
    res
      .status(404)
      .send(`The board with the ID: ${req.params.boardId} was NOT found`);
  } else {
    res.json(Object.assign(board, req.body));
  }
});

router.route('/:boardId').delete(async (req, res) => {
  const boards = await boardsService.getAll();
  const boardIndex = boards.findIndex(elem => elem.id === req.params.boardId);

  if (boardIndex === -1) {
    res
      .status(404)
      .send(`The board with the ID: ${req.params.boardId} was NOT found`);
  } else {
    const board = boards.splice(boardIndex, 1)[0];

    const tasks = await tasksService.getAll();

    let searchIndex = 0;
    while (searchIndex !== -1) {
      searchIndex = tasks.findIndex(
        elem => elem.boardId === req.params.boardId
      );
      if (searchIndex !== -1) {
        tasks.splice(searchIndex, 1);
      }
    }

    res.json(board);
  }
});

module.exports = router;
