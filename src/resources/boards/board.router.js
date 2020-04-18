const router = require('express').Router();
const Board = require('./board.model');
// const boardsService = require('./board.service');

// const tasksService = require('../tasks/task.service');

// const Task = require('../tasks/task.model');
// const MongooseTask = require('../tasks/task.router').MongooseTask;

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const customSchema = new Schema(
  {
    _id: {
      type: String
    }
  },
  {
    strict: false,
    versionKey: false
  }
);

const MongooseBoard = mongoose.model('Board', customSchema);

// Get all boards
router.route('/').get(async (req, res) => {
  // const boards = await boardsService.getAll();
  // res.json(boards);
  MongooseBoard.find()
    .lean()
    .exec()
    .then(data => {
      res.status(200).json(data.map(Board.toGet));
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Get a board by ID
router.route('/:boardId').get(async (req, res) => {
  MongooseBoard.findById(req.params.boardId)
    .exec()
    .then(data => {
      if (!data) {
        return res
          .status(404)
          .send(`The board with the ID: ${req.params.boardId} was NOT found`);
      }
      res.status(200).json(Board.toGet(data.toObject()));
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Create a new board
router.route('/').post(async (req, res) => {
  const board = new Board(req.body);

  const mongooseBoard = new MongooseBoard(Board.toSend(board));

  mongooseBoard
    .save()
    .then(() => {
      res.status(200).json(board);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Update a board by ID
router.route('/:boardId').put(async (req, res) => {
  MongooseBoard.findByIdAndUpdate(
    req.params.boardId,
    req.body,
    { new: true, useFindAndModify: false },
    (err, doc) => {
      if (err) {
        res.status(500).json(err);
      }
      if (!doc) {
        return res
          .status(404)
          .send(`The board with the ID: ${req.params.boardId} was NOT found`);
      }
      res.status(200).json(Board.toGet(doc.toObject()));
    }
  );
});

// Delete a board by ID
router.route('/:boardId').delete(async (req, res) => {
  MongooseBoard.findOneAndRemove(
    { _id: req.params.boardId },
    { useFindAndModify: false }
  ).exec((err, item) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!item) {
      return res
        .status(404)
        .send(`The board with the ID: ${req.params.boardId} was NOT found`);
    }
    //
    // MongooseTask.find()
    //   .lean()
    //   .exec()
    //   .then(data => {
    //     let searchIndex = 0;
    //     while (searchIndex !== -1) {
    //       searchIndex = data.findIndex(
    //         elem => elem.boardId === req.params.boardId
    //       );
    //       if (searchIndex !== -1) {
    //         // tasks.splice(searchIndex, 1);
    //         MongooseTask.findOneAndRemove(
    //           { _id: data[searchIndex]._id },
    //           { useFindAndModify: false }
    //           // eslint-disable-next-line no-loop-func
    //         ).exec((error, elem) => {
    //           if (error) {
    //             return res.status(500).json(err);
    //           }
    //           if (!elem) {
    //             return res
    //               .status(404)
    //               .send(
    //                 `The task with the ID: ${req.params.taskId} was NOT found`
    //               );
    //           }
    //           res.json(Task.toGet(item.toObject()));
    //         });
    //       }
    //     }
    //   })
    //   .catch(caughtErr => {
    //     res.status(500).json(caughtErr);
    //   });
    //
    res.json(Board.toGet(item.toObject()));
  });

  // TASKS!!!
});

// router.route('/:boardId').delete(async (req, res) => {
//   const boards = await boardsService.getAll();
//   const boardIndex = boards.findIndex(elem => elem.id === req.params.boardId);

//   if (boardIndex === -1) {
//     res
//       .status(404)
//       .send(`The board with the ID: ${req.params.boardId} was NOT found`);
//   } else {
//     const board = boards.splice(boardIndex, 1)[0];

//     const tasks = await tasksService.getAll();

//     let searchIndex = 0;
//     while (searchIndex !== -1) {
//       searchIndex = tasks.findIndex(
//         elem => elem.boardId === req.params.boardId
//       );
//       if (searchIndex !== -1) {
//         tasks.splice(searchIndex, 1);
//       }
//     }

//     res.json(board);
//   }
// });

module.exports = router;
