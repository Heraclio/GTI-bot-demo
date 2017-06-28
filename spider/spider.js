class Spider {
  constructor(database) {
    this.database = this.database.bind(this);
    this.start = this.start.bind(this);
  }

  database(database) {
    this.database = database;
    return this;
  }

  start() {
    console.log(this);
  }

}

module.exports = new Spider();
