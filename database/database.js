const JsonDB = require('node-json-db');

class Database {
  constructor() {
    this.start = this.start.bind(this);
  }

  start(name) {
    return new JsonDB(name, true, false);
  }
}

module.exports = new Database();
