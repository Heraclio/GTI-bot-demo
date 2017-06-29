const cheerio = require('cheerio');
const phantom = require('phantom');

const database = require('./database/database').start('database/emails');

class Spider {
  constructor() {
    this.start = this.start.bind(this);
    this.scrape = this.scrape.bind(this);
  }

  start(url) {
    const scrape = this.scrape;

     phantom.create().then((instance) => {
      instance.createPage().then((page) => {
        page.open(url).then(() => {
          page.setting('javascriptEnabled').then(function(value){
            page.property('content').then((html) => {
              scrape(html, () => {
                instance.exit();
              })
            });
          });
        });
      });
    });
  }

  scrape(html, callback) {
    const $ = cheerio.load(html);
    let emails;
    let counter = 0;

    try {
      emails = database.getData('/emails');
    } catch (e) {
      emails = [];
    }

    $('#comments').children('.comment').each((index, element) => {
      const email = $(element).children('.email').text().replace('Email: ', '');
      const key = email.split('@')[0];

      const push = emails.filter((item) => {
        return item[key];
      });

      if(push.length === 0) {
        const date = $(element).children('.date').text();
        const object = {};

        object[`${key}`] = email;

        database.push('/emails[]', object);

        counter++;
      }
    });

    if(counter > 0) {
      console.log(`${counter} emails have been scrapped.`);
    } else {
      console.log(`0 emails have been scrapped.`);
    }

    console.log('--------------------------------------------');

    try {
      console.log('Information Collected');
      console.log(database.getData('/emails'));
    } catch (e) {
      console.log('No information has been collected');
    }

    console.log('--------------------------------------------');

    callback();
  }
}

const spider = new Spider();

spider.start('http://127.0.0.1:3030/');
