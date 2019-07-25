const express = require('express');
const router = express.Router();

const userContoroller = require('./user.controller');

router.get('/', userContoroller.index);

router.get('/:id', userContoroller.show);

router.delete('/:id', userContoroller.destroy);

router.post('/', userContoroller.create);   

module.exports = router;