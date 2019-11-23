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

    console.log("card index");
    res.json("card index");

    db.setRData("Hello", "World");
};

exports.cardList = (req, res) => {
    config.printApiLog(1, config.card_url + "/v1/applycard/cardproductinfo" , 1);
    const hpno = req.body.hpno;
    if (!hpno) {
        console.log("hpno is none")
        res.json("hpno is none");
        return
    }

    var postHeader = {
        "Content-Type" : "application/json; charset=UTF-8"
    };

    var postBody = {
        "dataBody": {
            "crdPdN":"AUAARH"
        }
    };

    var postOption = {
        header: postHeader
        , url: config.card_url + "/v1/applycard/cardproductinfo"   
        , method: "POST"
        , body: JSON.stringify(postBody)
    };
    config.printApiLog(2, config.card_url + "/v1/applycard/cardproductinfo" , 1);
    request.post(postOption, function(error, httpResponse, body) {
        if (error) {
            console.log(error); 
            return;
        } 

        
        var json_body = JSON.parse(body);
        config.printApiLog(3, config.card_url + "/v1/applycard/cardproductinfo" , 1);
        config.printDataLog(json_body)
        // console.log(json_body.dataBody.grp001);
        // if (json_body.dataHeader.successCode == "0") {
        //     var list = json_body.dataBody.grp001;
        //     for (var i = 0; i < list.length; i++) {
        //         console.log("[" + (i + 1) + "] " + JSON.stringify(list[i]));
        //     }
        // }
        db.getRData(hpno, function(data) {
            var data2 = {
                "dataHeader": json_body.dataHeader,
                "dataBody": { 
                    "customerName": data,
                    "phoneNumber": hpno,
                    "creditCardList": [
                        {
                            "cardName": "D-day",
                            "yearFee": "18000",
                            "cardType": "credit",
                            "cardBonus": [
                                {
                                    "title":"Day 서비스",
                                    "content":"요일별 지정 영역에서 5% 마이신한포인트 적립"
                                },
                                {
                                    "title":"Week 서비스",
                                    "content":"매주 월요일 오전 스타벅스 최대 2,000원 할인"
                                },
                                {
                                    "title":"Month 서비스",
                                    "content":"멜론 음악/아마존프라임비디오 스트리밍 2,000원 할인"
                                },
                                {
                                    "title":"Year 서비스",
                                    "content":"더라운지멤버스 본인 + 동반자 공항 라운지 무료 입장, 에어서울 20,000원 할인"
                                }
                            ]
                        },
                        {
                            "cardName": "Deep Dream Platinum+",
                            "yearFee": "33000",
                            "cardType": "credit",
                            "cardBonus": [
                                {
                                    "title":"모두드림",
                                    "content":"적립한도 없이 국내/외 가맹점 이용금액(일시불+할부) 전월 이용금액별 0.7~1.1% 기본 포인트 적립"
                                },
                                {
                                    "title":"더해드림",
                                    "content":"DREAM영역은 기본의 3배(2.4~3.3%) 포인트 적립"
                                },
                                {
                                    "title":"챙겨드림",
                                    "content":"DREAM영역 중 가장 많이 이용한 영역은 기본의 5배(4.0~5.5%) 포인트 자동적립"
                                },
                                {
                                    "title":"아껴드림",
                                    "content":"주말(토,일) 전 주유소 리터당 80원 적립, 택시 3,6,9번째 2,000원 할인"
                                },
                                {
                                    "title":"Platinum+ 서비스",
                                    "content":"제주항공, 에어부산 10% 결제일 할인, 해외 이용금액 10% 캐시백"
                                }
                            ]
                        },
                        {
                            "cardName": "Deep Oil",
                            "yearFee": "13000",
                            "cardType": "credit",
                            "cardBonus": [
                                {
                                    "title":"주유서비스",
                                    "content":"4개의 정유사 (GS칼텍스, SK에너지, S-OIL, 현대오일뱅크) 중 직접 고른 1개 정유사 주유 이용금액 10% 결제일 할인"
                                },
                                {
                                    "title":"차량서비스",
                                    "content":"정비소(스피드메이트), 주차장 이용금액 10% 결제일 할인"
                                },
                                {
                                    "title":"생활서비스",
                                    "content":"편의점(GS25, CU), 커피(스타벅스, 이디야), 택시 이용금액 5% 결제일 할인"
                                },
                                {
                                    "title":"영화서비스",
                                    "content":"롯데시네마 일반관 5,000원 현장 할인"
                                }
                            ]
                        },
                        {
                            "cardName": "Deep Dream",
                            "yearFee": "0",
                            "cardType": "debit",
                            "cardBonus": [
                                {
                                    "title":"모두드림",
                                    "content":"전월 실적/적립 한도 없이 국내/외 이용 가맹점 0.2% 기본 포인트 적립"
                                },
                                {
                                    "title":"더해드림",
                                    "content":"자주 가는 DREAM영역은 기본의 3배(총 0.6%) 포인트 적립"
                                },
                                {
                                    "title":"챙겨드림",
                                    "content":"DREAM영역 중 가장 많이 이용한 영역은 기본의 5배(총 1.0%) 포인트 자동적립"
                                },
                                {
                                    "title":"아껴드림",
                                    "content":"주말(토,일) 전 주유소 리터당 40원 적립, 매 월 택시 3,6,9회째 이용할 때마다 1,000원 할인"
                                },
                                {
                                    "title":"반겨드림",
                                    "content":"포인트 적립"
                                }
                            ]
                        },
                        {
                            "cardName": "Deep On",
                            "yearFee": "0",
                            "cardType": "debit",
                            "cardBonus": [
                                {
                                    "title":"",
                                    "content":"국내 전 가맹점 0.2% 적립"
                                },
                                {
                                    "title":"",
                                    "content":"간편결제(pay) 최대 2% 적립"
                                },
                                {
                                    "title":"",
                                    "content":"편의점(CU) 최대 2% 적립"
                                },
                                {
                                    "title":"",
                                    "content":"커피(스타벅스, 투썸플레이스) 최대 2% 적립"
                                },
                                {
                                    "title":"",
                                    "content":"해외 전 가맹점 이용액(온라인 포함) 0.5% 적립"
                                },
                                {
                                    "title":"",
                                    "content":"해외 현금인출 1.5% 적립"
                                }
                            ]
                        },
                        {
                            "cardName": "신한 체크카드(무지)",
                            "yearFee": "0",
                            "cardType": "debit",
                            "cardBonus": [
                                {
                                    "title":"",
                                    "content":"카카오페이 결제 시 2% 적립"
                                },
                                {
                                    "title":"",
                                    "content":"대중교통 3% 적립(버스/지하철)"
                                },
                                {
                                    "title":"",
                                    "content":"이동통신요금 자동 이체 시 3% 적립"
                                },
                                {
                                    "title":"",
                                    "content":"CGV 영화 이용 시 최대 3천원 적립"
                                }
                            ]
                        }
                    ]
                }
            }
            res.json(data2);
            config.printApiLog(4, config.card_url + "/v1/applycard/cardproductinfo" , 1);
        });
    });
}

exports.cardUsage = (req, res) => {
    config.printApiLog(1, config.card_url + "/v1/usecreditcard/searchusefordomestic"  , 1);
    config.printApiLog(1, config.card_url + "/v1/usedebitcard/searchusefordomestic"  , 1);
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
            "nxtQyKey":"",
            "inqterm":"2019050720190805",
            "bctag":"0"
        }
    };

    var postOption = {
        header: postHeader
        , url: config.card_url + "/v1/usecreditcard/searchusefordomestic"   
        , method: "POST"
        , body: JSON.stringify(postBody)
    };

    var postOption2 = {
        header: postHeader
        , url: config.card_url + "/v1/usedebitcard/searchusefordomestic"
        , method: "POST"
        , body: JSON.stringify(postBody)
    }

    async.waterfall([
        function(callback) {
            config.printApiLog(2, config.card_url + "/v1/usecreditcard/searchusefordomestic"  , 1);
            request.post(postOption, function(error, httpResponse, body) {
                if (error) {
                    console.log(error); 
                    return;
                } 
        
                
                var json_body = JSON.parse(body);
                config.printApiLog(3, config.card_url + "/v1/usecreditcard/searchusefordomestic"  , 1);
                config.printDataLog(json_body)
                callback(null, json_body);
            });
        },
        function(before_data, callback) {
            config.printApiLog(2, config.card_url + "/v1/usedebitcard/searchusefordomestic"  , 1);
            request.post(postOption2, function(error, httpResponse, body) {
                if (error) {
                    console.log(error); 
                    return;
                } 
        
                
                var json_body = JSON.parse(body);
                config.printApiLog(3, config.card_url + "/v1/usedebitcard/searchusefordomestic"  , 1);
                config.printDataLog(json_body)
                dataMerge(hpno, before_data, json_body, function(data) {
                    res.json(data);
                    config.printApiLog(4, config.card_url + "/v1/usecreditcard/searchusefordomestic"  , 1);
                    config.printApiLog(4, config.card_url + "/v1/usedebitcard/searchusefordomestic"  , 1);
                });
            });
            // res.json(data);
        }
    ]);
}

function dataMerge(hpno, data1, data2, callback) {

    if (data1.dataHeader.successCode == "0" && data2.dataHeader.successCode == "0") {
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
                    "checkMonthlyAmtList": [
                        { "month": "01", "totalAprvAmt": "600000" },
                        { "month": "02", "totalAprvAmt": "300000" },
                        { "month": "03", "totalAprvAmt": "14000" },
                        { "month": "04", "totalAprvAmt": "200000" },
                        { "month": "05", "totalAprvAmt": "6000" },
                        { "month": "06", "totalAprvAmt": "134500" },
                        { "month": "07", "totalAprvAmt": "412000" },
                        { "month": "08", "totalAprvAmt": "33000" },
                        { "month": "09", "totalAprvAmt": "1200000" },
                        { "month": "10", "totalAprvAmt": "33333" },
                        { "month": "11", "totalAprvAmt": "123330" },
                    ],
                    "creditMonthlyAmtList": [
                        { "month": "01", "totalAprvAmt": "1600000" },
                        { "month": "02", "totalAprvAmt": "900000" },
                        { "month": "03", "totalAprvAmt": "322000" },
                        { "month": "04", "totalAprvAmt": "720000" },
                        { "month": "05", "totalAprvAmt": "11000" },
                        { "month": "06", "totalAprvAmt": "99200" },
                        { "month": "07", "totalAprvAmt": "11000" },
                        { "month": "08", "totalAprvAmt": "2320000" },
                        { "month": "09", "totalAprvAmt": "87000" },
                        { "month": "10", "totalAprvAmt": "564000" },
                        { "month": "11", "totalAprvAmt": "60300" },
                    ]
                } 
            }
            callback(data3);
        })
    } else {
        return
    }
}