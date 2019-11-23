const express = require('express');
const router = express.Router();

const bankContoroller = require('./bank.controller');

// GET Example
router.get('/', bankContoroller.index);

// POST Example
router.post('/myAccount', bankContoroller.myAccount);

router.post('/retailAtm', bankContoroller.retailAtm);

router.post('/culture', bankContoroller.culture);

router.post('/main', bankContoroller.main);

router.post('/salary', bankContoroller.salary);

router.post('/name', bankContoroller.name);

module.exports = router;