const config = require('../../config/config.js');

var quertyString = require('querystring');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');
const JSON = require('JSON');
const async = require('async');

const request = require('request');
var moment = require('moment');
require('moment-timezone');

exports.index = (req, res) => {
    req.accepts('application/json');
    var key, value;

    if (req != null) {
        key = req.body;
        value = JSON.stringify(req.body);
    }

    hgetRData("mng_access_token", "01054103368", function(data) {
        console.log(data);
        // console.log("");
        // console.log(data.access_token);
        res.json(data);
    });
};

/**
 * 초대 코드 발급
 * METHOD: GET
 * INPUT: hpno
 * OUTPUT: result, code
 *          result: 결과 메시지
 *          code: 초대 코드
 */
exports.invite = (req, res) => {
    const hpno = req.params.hpno;
    if (!hpno) console.log("hpno is none");

    hgetRData("mng_access_token", hpno, function(data) {
        if (data) {
            moment.tz.setDefault("Asia/Seoul"); 
            var date = moment().format('YYYY.MM.DD HH:mm:ss'); 
            var recvData = JSON.parse(data);
            var access_token = recvData.access_token;
            var user_seq_no = recvData.user_seq_no;

            var second = 180;
            var key = access_token.substring(access_token.length - 6, access_token.length);
            var value = {
                hpno: hpno,
                user_seq_no: user_seq_no
            }
            setexRData(key, second, JSON.stringify(value));

            var result = {
                result: "00",
                code: key,
            }
            res.json(result);
        } else {
            res.json({result: "01"});
        }
    });
}

/**
 * 초대 코드 검증
 * METHOD: POST
 * INPUT: code
 * OUTPUT: result, hpno, user_seq_no
 *          result: 결과 메세지
 *          hpno: 모임주 번호
 *          user_seq_no: 모임 번호
 */
exports.check = (req, res) => {
    const code = req.body.code || ''; // 모임주 번호
    console.log("code = " + code);

    if (!code.length) return res.status(400).json({result: "09"}); // 클라이언트 코드 입력 안됨
    getRData(code, function(data) {
        if (!data) {
            return res.json({result: "01"}); // 초대 코드 만료
        } else {
            data = JSON.parse(data);
            var recvData = {
                result: "00",
                hpno: data.hpno,
                user_seq_no: data.user_seq_no
            }
            return res.json(recvData);
        }
    });
}
/**
 * 초대 코드 승인
 * METHOD: POST
 * INPUT: hpno1, hpno2, user_seq_no
 * OUTPUT: result
 *          00: 성공
 *          01: 코드 만료
 *          02: 서버 에러
 */
exports.agree = (req, res) => {
    const hpno1 = req.body.hpno1 || ''; // 모임주 번호
    const hpno2 = req.body.hpno2 || ''; // 모임원 번호
    const user_seq_no = req.body.user_seq_no || ''; // 모임 번호

    if (!hpno1.length || !hpno2.length || !user_seq_no.length) {
        return res.status(400).json({error: 'Incorrenct param'});
    }

    var key = "temp_" + hpno1;
    hgetRData("mng_group", hpno2, function(data) {
        var groupData = {
            "status": "N",
            "user_seq_no": user_seq_no
        };

        var recvData = "";

        if (data) {
            // console.log(data);
            recvData = JSON.parse(data);
            recvData.push(groupData);
        } else {
            recvData = groupData;
        }
        // console.log(recvData);
        // console.log(JSON.stringify(recvData));

        hsetRdata("mng_group", hpno2, JSON.stringify(recvData));
        res.status(200).json({result: "00"});
    });
}

/**
 * 메인화면 대표계좌 보여주기
 * METHOD: GET
 * INPUT: hpno
 * OUTPUT: result, 
 *          00: 정상
 *          09: 계좌보유 0개
 * 
 */
exports.getMyGroup = (req, res) => {
    const hpno = req.params.hpno;
    if (!hpno) console.log("hpno is none");

    hgetRData("mng_group", hpno, function(data) {
        if (!data) return res.json({result: "09"});

        data = JSON.parse(data);
        // console.log(data[0].user_seq_no);

        if (data.length > 0) {
            hgetallRData("mng_account_info", function(result) {
                var returnValue = {
                    result: "00",
                    list: []
                };
                for (var i = 0; i < data.length; i++) {
                    var no = data[i].user_seq_no;
                    if (result[no] != null) {
                        var jsonData = JSON.parse(result[no]);
                        if (jsonData.hasOwnProperty("acc_detail")) {
                            jsonData.acc_detail = undefined;
                        }
                        returnValue.list.push(jsonData);
                    }
                    // console.log("["+i+"] " + returnValue.list);
                }
                console.log(returnValue);
                res.json(returnValue);
            });
        } else {
            res.json({result: "09"});
        }
    });
}

/**
 * 계좌 상세 
 * METHOD: GET
 * INPUT: user_seq_no
 * OUTPUT: result, 상세리스트
 */
exports.getAccDetail = (req, res) => {
    const user_no = req.params.user_seq_no;
    if (!user_no) console.log("user_seq_no is none");

    hgetRData("mng_account_info", user_no, function(data) {
        if (data) {
            var result = {
                result: "00",
                list: data
            }

            res.json(result);
        } else {
            res.json({result: "09"});
        }
    });
}

/**
 * 이체 api
 * 출금 후 입금이 동기처리가 되어야함
 * METHOD: POST
 * INPUT: 이체 데이터 Json(hpno, amount, sender_user_seq_no, receiver_user_seq_no, transfer_date)
 * OUTPUT: 결과값
 */
exports.transfer = (req, res) => {
    const hpno = req.body.hpno || '';
    const amount = req.body.amount || '';
    const sender = req.body.sender_user_seq_no || '';
    const receiver = req.body.receiver_user_seq_no || '';
    const transfer_date = req.body.transfer_date || '';

    if (!hpno.length || !amount.length || !sender.length || !receiver.length || !transfer_date.length) {
        return res.status(400).json({error: 'Incorrenct param'});
    } else {
        console.log("hpno = " + hpno);
        console.log("amount = " + amount);
        console.log("sender = " + sender);
        console.log("receiver = " + receiver);
        console.log("transfer_date = " + transfer_date);
    }

    async.waterfall([
        function(callback) {
            console.log('1');
            // callback(false, "");
            hgetRData("account_detail", sender, function(data) {
                console.log(data);
                if (data) {
                    console.log(data);
                } else {
                    res.json("data not found");
                }
            });
        }, 
        function(data1, data2, data3, callback) {
            console.log('2');

        },
        function(callback) {
            console.log('3');
            callback(null);
        }

    ], function(err, data1, data2, data3) {
        if (err) console.log("error = " + err);
        console.log("data1 = " + data1);
        console.log("data2 = " + data2);
        console.log("data3 = " + data3);

    });
}


exports.userme = (req, res) => {
    const user = parseInt(req.params.user, 10);
    if (!user) {
        console.log("user is none")
    }

    hgetRData("mng_access_token", "01054103368", function(data) {
        if (data) {
            getUserMe(data.access_token, user, res);
        } else {
            res.json("data not found");
        }
    });
}

// 금융결제원 AccessToken 발급을위한 code를 받아 처리하는 로직
exports.callback = (req, res) => {
    var query = req.query;

    // get Code Phase
    var code = query.code;
    var scope = query.scope;
    var client_info = query.client_info;

    if (code != null) {
        console.log('code = ' + code);
        console.log('scope = ' + scope);
        console.log('client_info = ' + client_info);

        client.set('ta_code', code, redis.print);
        client.set('ta_scope', scope, redis.print);
        client.set('ta_client_info', client_info, redis.print);

        client.get('ta_code', function(err, result) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log('redis get code = ' + result);
        });

        getToken(code);
    }

    res.end();
};

// 사용자 조회 API
function getUserMe(access_token, user_seq_no, resp) {
    // console.log('access_token = ' + access_token);
    // console.log('user_seq_no = ' + user_seq_no);
    if (access_token != null && user_seq_no != null) {
        hgetRData("result_user_me", user_seq_no, function(data) {
            if (data) {
                resp.json(data);
            } else {
                var getHeader = {
                    "Authorization": "Bearer " + access_token
                }

                var option = {
                    headers: getHeader
                    , url: config.ob_url + config.user + "?" + "user_seq_no=" + user_seq_no 
                }

                request.get(option, function(err, response, body) {
                    if (err) console.log(err);
                    
                    // console.log(res.statusCode);
                    var json_body = JSON.parse(body);
                    // console.log(json_body);
                    hsetRdata("result_user_me", user_seq_no, JSON.stringify(json_body));
                    resp.json(json_body);
                });
            }
        });
    }

}

// 금융결제원 AccessToken을 발급받아 Redis에 저장까지 하는 로직
function getToken(token_code) {
    if (token_code != null) {
        var postHeader = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
        
        var postBody = 
            "code=" + token_code
            + "&" + "client_id=" + config.client_id
            + "&" + "client_secret=" + config.client_secret
            + "&" + "redirect_uri=" + config.redirect_url
            + "&" + "grant_type=authorization_code"; 

        var postOption = {
            header: postHeader
            , url: config.ob_url + config.getToken
            , method: 'POST'
            , body: postBody
        };

        request.post(postOption, function(err, res, body) {
            if (err) console.log(err);
            
            // console.log(res.statusCode);
            var json_body = JSON.parse(body);
            hsetRdata("mng_access_token", "01054103368", JSON.stringify(json_body)); // 승민: 01063137806, 낙진: 01054103368
        });
    }
}

// Redis 단일 데이터 get
function getRData(key, callback) {
    client.get(key, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            callback(res);
        }
        
    });
}

// Redis 단일 데이터 set
function setRData(key, val) {
    client.set(key, val, redis.print);
}

// Redis JSON 데이터 get
// Key와 Field를 요청하면 조건에 맞는 JSON Data를 Return
function hgetRData(key, field, callback) {
    client.hget(key, field, function(err, obj) {
        if (err) console.log(err);
        // var res = JSON.parse(obj);
        var res = obj;
        callback(res);
    });
}

// Redis JSON 데이터 get
// Key를 요청하면 조건에 맞는 JSON Data를 Return
function hgetallRData(key, callback) {
    client.hgetall(key, function(err, obj){
        if (err) console.log(err);
        var res = obj;
        callback(res);
    });
}

// Redis JSON 데이터 set
// Key와 Field에 val(json)을 저장
function hsetRdata(key, field, val) {
    client.hset(key, field, val);
}

function setexRData(key, second, val) {
    client.setex(key, second, val, redis.print);
}