const router = require('express').Router({ mergeParams: true });
const Task = require('./task.model');
// const tasksService = require('./task.service');

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

const MongooseTask = mongoose.model('Task', customSchema);

router.route('/').get(async (req, res) => {
  // const tasks = await tasksService.getAll();
  // res.json(tasks.filter(elem => elem.boardId === req.params.boardId));
  MongooseTask.find()
    .lean()
    .exec()
    .then(data => {
      res.status(200).json(data.map(Task.toGet));
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Get a task by ID
router.route('/:taskId').get(async (req, res) => {
  MongooseTask.findById(req.params.taskId)
    .exec()
    .then(data => {
      if (!data) {
        return res
          .status(404)
          .send(`The task with the ID: ${req.params.taskId} was NOT found`);
      }
      res.status(200).json(Task.toGet(data.toObject()));
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Create a new task
router.route('/').post(async (req, res) => {
  // const task = new Task(req.body);
  const task = Object.assign(new Task(req.body), {
    boardId: req.params.boardId
  });

  const mongooseTask = new MongooseTask(Task.toSend(task));

  mongooseTask
    .save()
    .then(() => {
      res.status(200).json(task);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
// router.route('/').post(async (req, res) => {
//   const tasks = await tasksService.getAll();
//   const task = new Task(req.body);
//   tasks.push(Object.assign(task, { boardId: req.params.boardId }));
//   res.json(task);
// });

// Update a task by ID
router.route('/:taskId').put(async (req, res) => {
  MongooseTask.find()
    .lean()
    .exec()
    .then(data => {
      const task = data.find(
        elem =>
          elem._id === req.params.taskId && elem.boardId === req.params.boardId
      );

      if (!task) {
        res
          .status(404)
          .send(`The task with the ID: ${req.params.taskId} was NOT found`);
      } else {
        // res.json(Object.assign(Task.toGet(task), req.body));
        MongooseTask.findByIdAndUpdate(
          req.params.taskId,
          req.body,
          { new: true, useFindAndModify: false },
          (err, doc) => {
            if (err) {
              res.status(500).json(err);
            }
            if (!doc) {
              return res
                .status(404)
                .send(
                  `The task with the ID: ${req.params.taskId} was NOT found`
                );
            }
            res.status(200).json(Task.toGet(doc.toObject()));
          }
        );
      }

      // res.status(200).json(data.map(Task.toGet));
    })
    .catch(err => {
      res.status(500).json(err);
    });

  // MongooseTask.findByIdAndUpdate(
  //   req.params.taskId,
  //   req.body,
  //   { new: true, useFindAndModify: false },
  //   (err, doc) => {
  //     if (err) {
  //       res.status(500).json(err);
  //     }
  //     if (!doc) {
  //       return res
  //         .status(404)
  //         .send(`The task with the ID: ${req.params.taskId} was NOT found`);
  //     }
  //     res.status(200).json(Task.toGet(doc.toObject()));
  //   }
  // );
});
// router.route('/:taskId').put(async (req, res) => {
//   const tasks = await tasksService.getAll();
//   const task = tasks.find(
//     elem => elem.id === req.params.taskId && elem.boardId === req.params.boardId
//   );

//   if (!task) {
//     res
//       .status(404)
//       .send(`The task with the ID: ${req.params.taskId} was NOT found`);
//   } else {
//     res.json(Object.assign(task, req.body));
//   }
// });

// Delete a task by ID
router.route('/:taskId').delete(async (req, res) => {
  MongooseTask.findOneAndRemove(
    { _id: req.params.taskId },
    { useFindAndModify: false }
  ).exec((err, item) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!item) {
      return res
        .status(404)
        .send(`The task with the ID: ${req.params.taskId} was NOT found`);
    }
    res.json(Task.toGet(item.toObject()));
  });
});
// router.route('/:taskId').delete(async (req, res) => {
//   const tasks = await tasksService.getAll();
//   const taskIndex = tasks.findIndex(elem => elem.id === req.params.taskId);

//   if (taskIndex === -1) {
//     res
//       .status(404)
//       .send(`The board with the ID: ${req.params.taskId} was NOT found`);
//   } else {
//     const task = tasks.splice(taskIndex, 1);
//     res.json(task);
//   }
// });

module.exports = { router, MongooseTask };
