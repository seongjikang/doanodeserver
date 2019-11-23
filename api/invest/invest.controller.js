const config = require('../../config/config.js');
const db = require('../../config/db.js')

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

    res.json("invest index");

    db.setRData("Hello", "investWorld");
};

exports.investSearch = (req, res) => {
    var url = "http://10.3.17.61:8082/v1/stock/search?category=kospi%2Ckosdaq&q=%EC%8B%A0%ED%95%9C&start=0&rows=20";

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
        // var data = json_body[0];
        // var returnValue = {
        //     result: "00",
        //     currencyCode: data.currencyCode,
        //     date: data.date.replace( /-/gi, '') + data.time.replace( /:/gi, ''),
        //     price: data.basePrice
        // };
        //res.json(returnValue);
    });

}

exports.investUsage = (req, res) => {
    config.printApiLog(1, config.invest_url + "/v1/stock/remq" , 1);
    config.printApiLog(1, config.invest_url + "/v1/info/newslist" , 1);
    const hpno = req.body.hpno;
    if (!hpno) {
        console.log("hpno is none");
        res.json("hpno is none");
        return
    };

    var postHeader = {
        "Content-Type" : "application/json; charset=UTF-8"
    };

    var postBody = {
        "dataBody": {
            "gubun" : "",
            "code" : "",
            "date" : ""
          }
    };

    var postOption = {
        header: postHeader
        , url: config.invest_url + "/v1/info/newslist"
        , method: "POST"
        , body: JSON.stringify(postBody)
    };

    var postBody2 = {
        "dataBody": {
            "acct_no" : "01234567890",
            "acct_gds_code" : "01",
            "acct_pwd" : "4400shinhanial%2FENC%2FPp831ci50Of3DpcOqy5ghA%3D%3D",
            "qry_tp_code" : "1",
            "uv_tp_code" : "1",
            "stbd_tp_code" : "1",
            "adup_tp_code" : "1",
            "mrkt_tp_code" : "1"
          }        
    };

    var postOption2 = {
        header: postHeader
        , url: config.invest_url + "/v1/stock/remq"
        , method: "POST"
        , body: JSON.stringify(postBody2)
    }

    async.waterfall([
        function(callback) { //주식잔고조회를 해
            config.printApiLog(2, config.invest_url + "/v1/stock/remq" , 1);
            request.post(postOption2, function(error, httpResponse, body) {
                if (error) {
                    console.log(error); 
                    return;
                } 
                
                config.printApiLog(3, config.invest_url + "/v1/stock/remq" , 1);
                var json_body = JSON.parse(body);
                config.printDataLog(json_body)
                var tt = json_body.dataBody.list;
                callback(null, json_body);
            });
        },
        function(before_data, callback) {//뉴스리스트
            config.printApiLog(2, config.invest_url + "/v1/info/newslist" , 1);
            request.post(postOption, function(error, httpResponse, body) {
                if (error) {
                    console.log(error); 
                    return;
                } 
                config.printApiLog(3, config.invest_url + "/v1/info/newslist" , 1);
                var json_body = JSON.parse(body);
                config.printDataLog(json_body)
                dataMerge(hpno, before_data, json_body, function(data) {
                    res.json(data);
                    config.printApiLog(4, config.invest_url + "/v1/stock/remq" , 1);
                    config.printApiLog(4, config.invest_url + "/v1/info/newslist" , 1);
                });
                
            });
        }
    ]);
}

function dataMerge(hpno, data1, data2, callback) {
    //data1 이 내가 가진 주식
    //data2 이 뉴스 리스트임

    if (data1.dataHeader.successCode == "0" && data2.dataHeader.successCode == "0") {
        var news1 = data2.dataBody.list[8].news_titl

        const myInvestnameList = []
       
        for (var i = 0; i < data1.dataBody.list.length; i++) {
            if (i == 0 || i == 3||i == 5||i == 6){
                if(i == 0){
                    var news = data2.dataBody.list[8].news_titl;
                    var showname = data1.dataBody.list[i].stbd_nm;
                    var isdeduct = 0;
                }else if ( i == 3){
                    showname = "피델리티 재팬 펀드";
                    news = "일본시장 불매운동으로 인한 급락";
                    isdeduct = 2;
                }
                else {
                    news = data2.dataBody.list[i].news_titl;
                    showname = data1.dataBody.list[i].stbd_nm,
                    isdeduct = 0;
                }
            }else {
                if(i == 1){
                    showname = "주식회사 술펀";
                    news = "세상에 없던 전통주, 가장 먼저 만나다"
                    isdeduct = 1;
                }else{
                    showname = data1.dataBody.list[i].stbd_nm,
                    isdeduct = 0;
                    news = data2.dataBody.list[i].news_titl;
                }   
            }
            var recvData = {
                name: showname,
                shrt_code: data1.dataBody.list[i].rdcn_code,
                evlt_amt: data1.dataBody.list[i].evlt_amt,
                buy_amt: data1.dataBody.list[i].buy_amt,
                uv_diff_ratio: data1.dataBody.list[i].uv_diff_ratio,
                news_titl: news,
                deduction: isdeduct
            }
            myInvestnameList[i] = recvData; 
        }
        db.getRData(hpno, function(data) {
            var data3 = {
                "dataHeader" : {
                    "successCode" : "0",
                    "resultCode" : "",
                    "resultMessage" : ""
                },
                "dataBody" : {
                    "customerName": data,
                    "phoneNumber": hpno,
                    "holdingStockList": [
                        myInvestnameList
                    ],
                    
                } 
            }
            callback(data3);
        })
    } else {
        return
    }
}

exports.searchInvest = (req, res) => {
    config.printApiLog(1, "searchInvest" , 1);
    const hpno = req.body.hpno;
    if (!hpno) {
        console.log("hpno is none");
        res.json("hpno is none");
        return
    };

    dataMergeinvest(hpno, function(data) {
        res.json(data);
        config.printApiLog(4, "searchInvest" , 1);
    });
}

function dataMergeinvest(hpno, callback) {
        db.getRData(hpno, function(data) {
            var data3 = {
                "dataHeader": {
                    "successCode": "0",
                    "resultCode": "",
                            "resultMessage": ""
                    },"dataBody":{
                        "customerName": data,
                        "phoneNumber": hpno,
                    "holdingStockList": [
                         {
                            "name":"후앤후", //주식 명
                            "trdprc":"1250", // 현재가
                            "invest_info":"플랫폼투자 | 하루만에 100%초과달성! | 스타트업 지원서비스" // 설명
                        }, {
                            "name":"아이디어", //주식 명
                            "trdprc":"20000", // 현재가
                            "invest_info":"스마트팩토리산업 투자ㅣAI기반 영상인식 솔루션 엣지디바이스" // 설명
                        }, {
                            "name":"주식회사 술펀", //주식 명
                            "trdprc":"12500", // 현재가
                            "invest_info":"구독경제산업 투자ㅣ세상에 없던 전통주, 가장 먼저 만나다" // 설명
                        }, {
                            "name":"주식회사 마텍", //주식 명
                            "trdprc":"100000", // 현재가
                            "invest_info":"수상레저산업 투자ㅣ보트쉐어링으로 즐기는 사계절수상레저파크" // 설명
                        }, {
                            "name":"라파젠", //주식 명
                            "trdprc":"3650", // 현재가
                            "invest_info":"바이오산업 투자ㅣ특허보유ㅣ천연물과 발효공학으로 신소재 개발" // 설명
                        }
                    ]	
                }	
            }
            callback(data3);
        })
}