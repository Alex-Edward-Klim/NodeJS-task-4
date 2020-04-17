const tasksRepo = require('./task.memory.repository');

const getAll = () => tasksRepo.getAll();

module.exports = { getAll };
