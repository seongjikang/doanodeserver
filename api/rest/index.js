const express = require('express');
const router = express.Router();

const restContoroller = require('./rest.controller');

router.get('/', restContoroller.index);

router.get('/invite/:hpno', restContoroller.invite);
router.post('/invite/check/', restContoroller.check)
router.post('/invite/agree', restContoroller.agree);

router.get('/group')

router.get('/userme/:user', restContoroller.userme);

router.get('/callback', restContoroller.callback);

module.exports = router;