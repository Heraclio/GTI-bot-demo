const request = require('request');
const cheerio = require('cheerio');
const database = require('./database/database').start('database/spider');

class Spider {
  constructor() {
    this.start = this.start.bind(this);
  }

  start(url) {
    request(url, (error, response, html) => {
      const $ = cheerio.load(html);

      // $.

    });
  }
}

const spider = new Spider();

spider.start('http://127.0.0.1:3030/');
