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


// 계좌 상세
router.get('/account/detail/:user_seq_no', restContoroller.getAccDetail);


// 이체
router.post('/transfer', restContoroller.transfer);



// 환율


module.exports = router;