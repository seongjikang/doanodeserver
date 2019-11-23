require('dotenv').config();

const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/bank', require('./api/bank'));
app.use('/card', require('./api/card'));
app.use('/invest', require('./api/invest'));
app.use('/life', require('./api/life'));

app.listen(3339, () => console.log('Start Server!\n'));

exports.app = app;