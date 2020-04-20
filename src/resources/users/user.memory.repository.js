// const hardcodedUsersDatabase = [];

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

const getAll = async () => {
  // TODO: mock implementation. should be replaced during task development
  // return hardcodedUsersDatabase;
  return MongooseUser.find()
    .lean()
    .exec()
    .then(data => {
      return data;
    })
    .catch(err => {
      return err;
    });
};

module.exports = { getAll, MongooseUser };
