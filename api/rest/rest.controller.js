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
                list: JSON.parse(data)
            }

            res.json(result);
        } else {
            res.json({result: "09"});
        }
    });
}

class transferData {
    constructor(t_type, a_type, s_no, r_no, amount, balance, t_date, memo) {
        this.transfer_type = t_type;
        this.amount_type = a_type;
        this.sender = s_no,
        this.receiver = r_no,
        this.amount = amount,
        this.balance = balance,
        this.date = t_date,
        this.memo = memo
    }
};

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
    const t_type = req.body.t_type || '';
    const a_type = req.body.a_type || '';
    const sender = req.body.sender_user_seq_no || '';
    const receiver = req.body.receiver_user_seq_no || '';
    const transfer_date = req.body.transfer_date || '';
    const memo = req.body.memo || '';
    const erate = req.body.erate || '';

    if (!hpno.length || !amount.length || !sender.length || !receiver.length || !transfer_date.length) {
        return res.status(400).json({error: 'Incorrenct param'});
    }

    if (t_type == "EF" || t_type == "EK") {
        if (erate == "") res.json({error: 'Incorrenct param'});
    }

    // console.log("== TRANSFER API ==");
    // console.log("hpno = " + hpno);
    // console.log("amount = " + amount);
    // console.log("t_type = " + t_type);
    // console.log("a_type = " + a_type);
    // console.log("sender = " + sender);
    // console.log("receiver = " + receiver);
    // console.log("transfer_date = " + transfer_date);
    // console.log("memo = " + memo);
    // console.log("erate = " + erate);
    // console.log("== TRANSFER API ==");

    var returnValue = {
        result: "00",
        amount: "",
        senderName: "",
        senderNo: "",
        receiverName: "",
        receiverNo: ""
    };

    async.waterfall([
        // 먼저 출금계좌에서 돈을 출금
        function(callback) {
            hgetRData("mng_account_info", sender, function(data) {
                if (data) {
                    var jsonData = JSON.parse(data);
                    var k_balance = parseInt(jsonData.koreaBalance);
                    var f_balance = parseInt(jsonData.foreignBalance);
                    var money = parseInt(amount);
                    var rate = parseInt(erate);

                    // console.log("jsonData = " + JSON.stringify(jsonData));

                    var balance = 0;
                    var other_balance = 0;
                    if (t_type == "O") {   // 원화로 입출금
                        if (k_balance < money) {
                            res.json("08") // 출금 잔액 부족
                            return;
                        }
                        balance = k_balance - money;
                        console.log("O balance = " + balance);
                        other_amount = money;
                    } else if (t_type == "EK") {            // 원화 환전 -> 원화를 외화로
                        if (k_balance < money) {
                            res.json("08") // 출금 잔액 부족
                            return;
                        }
                        balance = k_balance - money;
                        other_amount = Math.round(money / rate);
                        other_balance = f_balance + other_amount;
                    } else if (t_type == "EF") {            // 외화 환전 -> 외화를 원화로
                        if (f_balance < money) {
                            res.json("08") // 출금 잔액 부족
                            return;
                        }
                        balance = f_balance - money;
                        other_amount = Math.round(money * rate);
                        other_balance = k_balance + other_amount;
                    }
                    var tData = new transferData(t_type, a_type, sender, receiver, money, balance, transfer_date, memo);

                    transfer_process(1, tData, function(result, no, name) {
                        // console.log("first result = " + result);

                        tData.balance = other_balance;
                        tData.amount = money;

                        if (t_type == "EK") {
                            returnValue.amount = amount;
                        } else if (t_type == "EF") {
                            returnValue.amount = amount;
                        } else {
                            returnValue.amount = amount;    
                        }
                        returnValue.senderNo = no;
                        returnValue.senderName = name;
                        callback(null, tData);
                    });
                } else {
                    res.json("09"); // 출금계좌 못 찾음
                }
            });
        },

        // 출금이 성공하면 입금하여 마무리
        function(data, callback) {
            // console.log('>> tData = ' + JSON.stringify(data));
            if (data.transfer_type == "O") {
                data.transfer_type = "I";
            } else if (data.transfer_type == "I") {
                data.transfer_type = "O";
            } else if (data.transfer_type == "EF") {
                data.transfer_type = "EK";
                data.amount_type = "K";
            } else if (data.transfer_type == "EK") {
                data.transfer_type = "EF";
                data.amount_type = "F";
            }

            // console.log('>> cData = ' + JSON.stringify(data));

            transfer_process(2, data, function(result, no, name) {
                // console.log("second result = " + result);
                if (result == "00") {
                    returnValue.result = "00";
                    returnValue.receiverNo = no;
                    returnValue.receiverName = name;
                    res.json(returnValue);
                } else {
                    res.json({"result": "01"});
                }
            });
        }
    ]);
}

/**
 * 입출금 처리 함수
 */
function transfer_process(order, transfer_data, callback) {
    var t_type = transfer_data.transfer_type;   // I: 입금, O: 출금, EF: 외화환전, EK: 원화환전
    var a_type = transfer_data.amount_type;     // K: 원화, F: 외화
    var s_no = transfer_data.sender;
    var r_no = transfer_data.receiver;
    var amount = transfer_data.amount;
    var t_date = transfer_data.date;
    var balance = transfer_data.balance;
    var memo = transfer_data.memo;

    var no = 0;
    var person;
    if (order == 1) {
        no = s_no;
        if (t_type == "EK" || t_type == "EF") {
            person = s_no;
        } else {
            person = r_no;
        }
    } else if (order == 2) {
        person = s_no;
        if (t_type == "EK" || t_type == "EF") {
            no = s_no;
        } else {
            no = r_no;
        }
        
    }

    // console.log("[" + order + "] " + JSON.stringify(transfer_data));

    var transfer = {
        transfer_type: t_type,
        amount_type: a_type,
        person: person,
        amount: amount,
        balance: "",
        date: t_date,
        memo: memo
    };

    // console.log("order = " + order);

    hgetRData("mng_account_info", no, function(data) {
        if (data) {
            var jsonData = JSON.parse(data);

            var k_balance = parseInt(jsonData.koreaBalance);
            var f_balance = parseInt(jsonData.foreignBalance);

            // console.log("k_balance = " + k_balance);
            // console.log("f_balance = " + f_balance);
            // console.log("amount = " + amount);

            if (t_type == "I") {
                if (a_type == "K") {
                    jsonData.koreaBalance = k_balance + amount;
                    transfer.balance = jsonData.koreaBalance;
                    console.log("transfer.balance = " + transfer.balance);
                } else if (a_type == "F") {
                    jsonData.foreignBalance = f_balance + amount;
                    transfer.balance = jsonData.foreignBalance;
                }
            } else if (t_type == "O") {
                if (a_type == "K") {
                    // console.log("O K ");
                    jsonData.koreaBalance = k_balance - amount;
                    transfer.balance = jsonData.koreaBalance;
                } else if (a_type == "F") {
                    // console.log("O F ");
                    jsonData.foreignBalance = f_balance - amount;
                    jsonData.balance = jsonData.foreignBalance;
                }
            } else {
                if (a_type == "K") {
                    jsonData.koreaBalance = balance;
                    transfer.balance = jsonData.koreaBalance;
                } else if (a_type == "F") {
                    jsonData.foreignBalance = balance;
                    transfer.balance = jsonData.foreignBalance;
                }
            }
            jsonData.acc_detail.push(transfer);
            hsetRdata("mng_account_info", no, JSON.stringify(jsonData));
            callback("00", jsonData.accountNo, jsonData.accountName);
        } else {
            callback("01");
        }
    });
}

exports.eRate = (req, res) => {
    var url = "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD";

    var getHeader = {
        // "Authorization": "Bearer " + access_token
    }

    var option = {
        headers: getHeader
        , url: url
    }

    request.get(option, function(err, response, body) {
        if (err) console.log(err);
        
        var json_body = JSON.parse(body);
        var data = json_body[0];
        var returnValue = {
            result: "00",
            currencyCode: data.currencyCode,
            date: data.date.replace( /-/gi, '') + data.time.replace( /:/gi, ''),
            price: data.basePrice
        };
        console.log(returnValue);
        res.json(returnValue);
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
            "transfer_data-Type": "application/x-www-form-urlencoded"
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