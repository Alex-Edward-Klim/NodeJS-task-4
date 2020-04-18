const uuid = require('uuid');

class User {
  constructor({
    id = uuid(),
    name = 'USER',
    login = 'user',
    password = 'P@55w0rd'
  } = {}) {
    this.id = id;
    this.name = name;
    this.login = login;
    this.password = password;
  }

  static toResponse(user) {
    const { id, name, login } = user;
    return { id, name, login };
  }

  static toGet(user) {
    const id = user._id;
    const { name, login } = user;
    return { id, name, login };
  }

  static toSend(user) {
    const _id = user.id;
    const { name, login, password } = user;
    return { _id, name, login, password };
  }
}

module.exports = User;
