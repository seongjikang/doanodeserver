const express = require('express');
const router = express.Router();

const restContoroller = require('./rest.controller');

router.get('/', restContoroller.index);

router.get('/userme/:user', restContoroller.userme);

router.get('/callback', restContoroller.callback);

module.exports = router;