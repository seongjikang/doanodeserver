const express = require('express');
const router = express.Router();

const restContoroller = require('./rest.controller');

router.get('/', restContoroller.index);

router.get('/user', restContoroller.index);

router.get('/callback', restContoroller.callback);

module.exports = router;