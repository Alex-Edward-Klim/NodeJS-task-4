const uuid = require('uuid');

class Task {
  constructor({
    id = uuid(),
    title = 'TASK',
    order = 0,
    description = 'Lorem ipsum',
    userId = null,
    boardId = null,
    columnId = null
  } = {}) {
    this.id = id;
    this.title = title;
    this.order = order;
    this.description = description;
    this.userId = userId;
    this.boardId = boardId;
    this.columnId = columnId;
  }

  static toGet(task) {
    const id = task._id;
    const { title, order, description, userId, boardId, columnId } = task;
    return { id, title, order, description, userId, boardId, columnId };
  }

  static toSend(task) {
    const _id = task.id;
    const { title, order, description, userId, boardId, columnId } = task;
    return { _id, title, order, description, userId, boardId, columnId };
  }
}

module.exports = Task;
