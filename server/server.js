const express = require('express');
const path = require('path');
const http = require('http');
const database = require('../database/database').start('server');
const bodyParser = require('body-parser');
const app = express();
const server = http.createServer(app);

class Server {
  constructor() {
    this.port = 3000;
    this.host = 'localhost';
    this.start = this.start.bind(this);
  }

  start() {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname + '/client/index.html'));
    });

    app.post('/api/comment', (req, res) => {
      const author = req.body.author;
      const email = req.body.email;
      const date = req.body.date;

      database.push('/comments[]', req.body, true);

      res.send({
        comments: database.getData('/comments')
      });
    });

    app.get('/api/comment', (req, res) => {
      res.send({
        comments: database.getData('/comments')
      });
    });

    app.use(express.static(path.join(__dirname, 'client')));

    server.listen(this.port, this.host);
    server.on('listening', () => {
      console.log(`web server start at ${server.address().address}:${server.address().port}`);
    });
  }
}

new Server().start();
