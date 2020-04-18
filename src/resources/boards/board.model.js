const uuid = require('uuid');

class Board {
  constructor({ id = uuid(), title = 'BOARD', columns = [] } = {}) {
    this.id = id;
    this.title = title;
    this.columns = columns;
  }

  static toGet(board) {
    const id = board._id;
    const { title, columns } = board;
    return { id, title, columns };
  }

  static toSend(board) {
    const _id = board.id;
    const { title, columns } = board;
    return { _id, title, columns };
  }
}

module.exports = Board;
