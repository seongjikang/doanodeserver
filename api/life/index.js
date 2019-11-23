const express = require('express');
const router = express.Router();

const lifeContoroller = require('./life.controller');

router.get('/', lifeContoroller.index);

// Card Usage Credit & Check
router.post('/lifeUsage', lifeContoroller.lifeUsage);
router.post('/culturePayment', lifeContoroller.culturePayment);
router.post('/cash', lifeContoroller.cash);
router.post('/publicTransfer', lifeContoroller.publicTransfer);
router.post('/searchInsurance', lifeContoroller.searchInsurance);

module.exports = router;