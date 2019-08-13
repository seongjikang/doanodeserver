require('dotenv').config();

const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser')

// const redis = require('redis');
// const client = redis.createClient(6379, '127.0.0.1');
// const JSON = require('JSON');

// app.use(function(req, res) {
//     console.log("redis cache use!");
//     req.cache = client;
//     // next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./api/users'));
app.use('/rest', require('./api/rest'));
app.use('/profile', require('./api/profile'))

app.listen(3000, () => console.log('Start Server!'));

exports.app = app;