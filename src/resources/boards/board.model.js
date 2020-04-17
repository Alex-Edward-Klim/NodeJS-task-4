const uuid = require('uuid');

class Board {
  constructor({ id = uuid(), title = 'USER', columns = [] } = {}) {
    this.id = id;
    this.title = title;
    this.columns = columns;
  }
}

module.exports = Board;
