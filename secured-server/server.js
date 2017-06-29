const express = require('express');

const path = require('path');
const http = require('http');

const bodyParser = require('body-parser');

const database = require('./database/database').start('database/server');

const app = express();
const server = http.createServer(app);

class Server {
  constructor() {
    this.port = 3030;
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
      res.sendFile(path.join(__dirname, '/client/index.html'));
    });

    app.post('/api/comment', (req, res) => {
      database.push('/comments[]', req.body, true);

      res.send({
        comments: database.getData('/comments')
      });
    });

    app.post('/api/database/delete', (req, res) => {
      let comments;

      database.delete('/comments');

      try {
        comments = database.getData('/comments');
      } catch (e) {
        comments = [];
      }

      res.send({
        comments: comments
      });
    });

    app.get('/api/comment', (req, res) => {
      let comments;

      try {
        comments = database.getData('/comments');
      } catch (e) {
        comments = [];
      }

      res.send({
        comments: comments
      });
    });

    app.use(express.static(path.join(__dirname, 'client')));

    app.get('*', (req, res) => {
      res.redirect(path.join(__dirname, '/client/index.html'));
    });

    server.listen(this.port, this.host);
    server.on('listening', () => {
      console.log(`web server start at ${server.address().address}:${server.address().port}`);
    });
  }
}

new Server().start();
