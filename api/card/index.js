const express = require('express');
const router = express.Router();

const cardContoroller = require('./card.controller');

router.get('/', cardContoroller.index);

// Card Usage Credit & Check
router.post('/cardUsage', cardContoroller.cardUsage);

// recommand Card List 
router.post('/cardList', cardContoroller.cardList);


module.exports = router;