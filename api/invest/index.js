const express = require('express');
const router = express.Router();

const investContoroller = require('./invest.controller');

router.get('/', investContoroller.index);
router.get('/investSearch', investContoroller.investSearch);
// Card Usage Credit & Check
router.post('/investUsage', investContoroller.investUsage);
router.post('/searchInvest', investContoroller.searchInvest);

module.exports = router;