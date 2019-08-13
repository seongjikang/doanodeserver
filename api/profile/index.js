const express = require('express');
const router = express.Router();

// const redis = require('redis');
// const client = redis.createClient(6379, '127.0.0.1');
// const JSON = require('JSON');

// app.use(function(req, res) {
//     console.log("redis cache use!");
//     req.cache = client;
//     // next();
// });

const profileController = require('./profile.controller');

// console.log("/profile main");
router.post('/', profileController.index);

router.post('/:name', profileController.setname);

module.exports = router;