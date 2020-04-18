const router = require('express').Router();
const User = require('./user.model');
// const usersService = require('./user.service');

// const tasksService = require('../tasks/task.service');

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

const MongooseUser = mongoose.model('User', customSchema);

// Get all users
router.route('/').get(async (req, res) => {
  MongooseUser.find()
    .lean()
    .exec()
    .then(data => {
      res.status(200).json(data.map(User.toGet));
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Get a user by ID
router.route('/:userId').get(async (req, res) => {
  MongooseUser.findById(req.params.userId)
    .exec()
    .then(data => {
      if (!data) {
        return res
          .status(404)
          .send(`The user with the ID: ${req.params.userId} was NOT found`);
      }
      res.status(200).json(User.toGet(data.toObject()));
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Create a new user
router.route('/').post(async (req, res) => {
  const user = new User(req.body);

  const mongooseUser = new MongooseUser(User.toSend(user));

  mongooseUser
    .save()
    .then(() => {
      res.status(200).json(User.toResponse(user));
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Update a user by ID
router.route('/:userId').put(async (req, res) => {
  MongooseUser.findByIdAndUpdate(
    req.params.userId,
    req.body,
    { new: true, useFindAndModify: false },
    (err, doc) => {
      if (err) {
        res.status(500).json(err);
      }
      if (!doc) {
        return res
          .status(404)
          .send(`The user with the ID: ${req.params.userId} was NOT found`);
      }
      res.status(200).json(User.toGet(doc.toObject()));
    }
  );
});

// Delete a user by ID
router.route('/:userId').delete(async (req, res) => {
  MongooseUser.findOneAndRemove(
    { _id: req.params.userId },
    { useFindAndModify: false }
  ).exec((err, item) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!item) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(User.toGet(item.toObject()));
  });

  // TASKS!!!
});

// router.route('/:userId').delete(async (req, res) => {
//   const users = await usersService.getAll();
//   const userIndex = users.findIndex(elem => elem.id === req.params.userId);

//   if (userIndex === -1) {
//     res
//       .status(404)
//       .send(`The user with the ID: ${req.params.userId} was NOT found`);
//   } else {
//     const user = users.splice(userIndex, 1)[0];

//     const tasks = await tasksService.getAll();
//     tasks.map(elem => {
//       if (elem.userId === user.id) {
//         elem.userId = null;
//       }
//     });

//     res.json(User.toResponse(user));
//   }
// });

module.exports = router;
