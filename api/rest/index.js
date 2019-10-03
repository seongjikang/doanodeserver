const express = require('express');
const router = express.Router();

const restContoroller = require('./rest.controller');

router.get('/', restContoroller.index);
router.get('/userme/:user', restContoroller.userme);
router.get('/callback', restContoroller.callback);




// 초대 코드 관련 로직
router.get('/invite/:hpno', restContoroller.invite);
router.post('/invite/check/', restContoroller.check);
router.post('/invite/agree', restContoroller.agree);
// 초대 코드 관련 로직



// 메인 화면
router.get('/group/:hpno', restContoroller.getMyGroup);




module.exports = router;