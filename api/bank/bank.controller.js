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

    console.log("bank index");
    res.json("bank index");

    db.setRData("Hello", "World");
};

exports.name = (req, res) => {
    config.printApiLog(1, "name", 1);
    const hpno = req.body.hpno;
    if (!hpno) {
        console.log("hpno is none")
        res.json("hpno is none");
        return
    }

    db.getRData(hpno, function(data) {
        // console.log(data)
        var data2 = {
            "name": data
        }
        
        res.json(data2);
        config.printApiLog(4, "name", 1);
    });
};

exports.salary = (req, res) => {
    config.printApiLog(1, config.bank_url + "/v1/account/deposit/detail", 1);
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
            "serviceCode":"D1130",
            "정렬구분":"1",
            "조회시작일":"20190228",
            "조회종료일":"20190830",
            "조회기간구분":"1",
            "은행구분":"1",
            "계좌번호":"230221966424"
        }
    };

    var postOption = {
        header: postHeader
        , url: config.bank_url + "/v1/account/deposit/detail"   
        , method: "POST"
        , body: JSON.stringify(postBody)
    };

    config.printApiLog(2, config.bank_url + "/v1/account/deposit/detail", 1);
    request.post(postOption, function(error, httpResponse, body) {
        
        if (error) {
            console.log(error); 
            return;
        } 

        config.printApiLog(3, config.bank_url + "/v1/account/deposit/detail", 1);
        // config.printDataLog(body);
        var json_body = JSON.parse(body);
        config.printDataLog(json_body);
        db.getRData(hpno, function(data) {
            var data2 = {
                "dataHeader": json_body.dataHeader,
                "dataBody": { 
                    "customerName": data,
                    "phoneNumber": hpno,
                    "salaryAmt": 40000000
                }
            }
            res.json(data2);
            config.printApiLog(4, config.bank_url + "/v1/account/deposit/detail", 1);
        });
    });
}

exports.retailAtm = (req, res) => {
    config.printApiLog(1, config.bank_url + "/v1/search/branch-category/keyword", 1);
    const hpno = req.body.hpno;
    const keyword = req.body.keyword;
    if (!hpno && !keyword) {
        console.log("parameter error");
        res.json("parameter error");
        return
    }

    var postHeader = {
        "Content-Type" : "application/json; charset=UTF-8"
    };

    var postBody = {
        "dataBody": {
            "serviceCode": "E4307",
            "검색어": keyword
        }
    } 

    var postOption = {
        header: postHeader
        , url: config.bank_url + "/v1/search/branch-category/keyword"   
        , method: "POST"
        , body: JSON.stringify(postBody)
    };

    config.printApiLog(2, config.bank_url + "/v1/search/branch-category/keyword", 1);
    request.post(postOption, function(error, httpResponse, body) {
        if (error) {
            console.log(error); 
            return;
        }        
        // console.log(body);
        config.printApiLog(3, config.bank_url + "/v1/search/branch-category/keyword", 1);
        var json_body = JSON.parse(body);
        config.printDataLog(json_body);
        var result = json_body.dataBody.검색결과;
        // console.log(result);
        var nResult = [
            {
				"x":"37.574451",
				"y":"126.980498",
				"atmName":"신한은행 ATM 연합뉴스 지점"
			}, {
				"x":"37.570146",
				"y":"126.986410",
				"atmName":"신한은행 ATM 종로 1 지점"
			}, {
				"x":"37.570427",
				"y":"126.991814",
				"atmName":"신한은행 종로 5가 지점 ATM"
			}, {
				"x":"37.567383",
				"y":"127.001857",
				"atmName":"신한은행 을지로 5가 지점 ATM"
			}, {
				"x":"37.562497",
				"y":"127.002990",
				"atmName":"신한은행 퇴계로 ATM"
			}, {
				"x":"37.561549",
				"y":"126.986133",
				"atmName":"신한은행 충무로 ATM"
			}, {
				"x":"37.561882",
				"y":"126.990856",
				"atmName":"신한은행 ATM 충무로 극동금융센터"
			}
        ];

        db.getRData(hpno, function(data) {
            var data2 = {
                "dataHeader": json_body.dataHeader,
                "dataBody": { 
                    "customerName": data,
                    "phoneNumber": hpno,
                    "atmList": nResult
                }
            }
            res.json(data2);
            config.printApiLog(4, config.bank_url + "/v1/search/branch-category/keyword", 1);
        });
    });
}

exports.culture = (req, res) => {
    config.printApiLog(1, "culture", 1);
    const hpno = req.body.hpno;
    const keyword = req.body.keyword;
    if (!hpno && !keyword) {
        console.log("parameter error");
        res.json("parameter error");
        return
    }

    db.getRData(hpno, function(data) {
        var data = {
            "dataHeader": {
                "successCode": "0",
                "resultCode": "",
                "resultMessage": ""
            }, "dataBody": {
                "customerName": data,
                "phoneNumber": hpno,
                "curtureList": [
                    {
                        "x":"37.570496",
                        "y":"126.999368",
                        "atmName":"광장시장"
                    }, {
                        "x":"37.568695",
                        "y":"127.000790",
                        "atmName":"방산시장"
                    }, {
                        "x":"37.563484",
                        "y":"126.995116",
                        "atmName":"인현시장"
                    }, {
                        "x":"37.565661",
                        "y":"127.000566",
                        "atmName":"중부시장"
                    }, {
                        "x":"37.570695",
                        "y":"127.010824",
                        "atmName":"동문시장"
                    }, {
                        "x":"37.573688",
                        "y":"127.011060",
                        "atmName":"창신시장"
                    }
                ]
            }
        }
        res.json(data);
        config.printApiLog(4, "culture", 1);
    });
    
}

exports.myAccount = (req, res) => {
    config.printApiLog(1, config.bank_url + "/v1/account/deposit/detail", 1);
    config.printApiLog(1, config.bank_url + "/v1/account/fund/detail", 1);
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
            "serviceCode":"D1130",
            "정렬구분":"1",
            "조회시작일":"20190228",
            "조회종료일":"20190830",
            "조회기간구분":"1",
            "은행구분":"1",
            "계좌번호":"230221966424"
        }
    } 

    var postBody2 = {
        "dataBody": {
            "거래구분":"1",
            "계좌번호":"250132675998",
            "은행구분":"1",
            "미기장거래":"1",
            "직원조회":"1",
            "정렬구분":"2"
        }   
    };

    var postOption = {
        header: postHeader
        , url: config.bank_url + "/v1/account/deposit/detail"   
        , method: "POST"
        , body: JSON.stringify(postBody)
    };

    var postOption2 = {
        header: postHeader
        , url: config.bank_url + "/v1/account/fund/detail"
        , method: "POST"
        , body: JSON.stringify(postBody2)
    }

    async.waterfall([
        function(callback) {
            config.printApiLog(2, config.bank_url + "/v1/account/deposit/detail", 1);
            request.post(postOption, function(error, httpResponse, body) {
                if (error) {
                    console.log(error); 
                    return;
                } 
                
                config.printApiLog(3, config.bank_url + "/v1/account/deposit/detail", 1);
                var json_body = JSON.parse(body);
                config.printDataLog(json_body);
                callback(null, json_body);
            });
        },
        function(before_data, callback) {
            config.printApiLog(2, config.bank_url + "/v1/account/fund/detail", 1);
            request.post(postOption2, function(error, httpResponse, body) {
                if (error) {
                    console.log(error); 
                    return;
                } 
                config.printApiLog(3, config.bank_url + "/v1/account/fund/detail", 1);
                var json_body = JSON.parse(body);
                config.printDataLog(json_body);
                dataMerge(hpno, before_data, json_body, function(data) {
                    res.json(data);
                    config.printApiLog(4, config.bank_url + "/v1/account/deposit/detail", 1);
                    config.printApiLog(4, config.bank_url + "/v1/account/fund/detail", 1)
                });
            });
            // res.json(data);
        }
    ]);
}

function dataMerge(hpno, data1, data2, callback) {

    if (data1.dataHeader.successCode == "0" && data2.dataHeader.successCode == "0") {
        // console.log("Success!");
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
                    "depositAccountList": [
                        {
                            "accountNumber":"123456789",
                            "bankGbn":"신한은행",
				            "accountGbn":"house",
                            "accountName":"주택청약종합저축",
                            "accountBalance":"2400000"
                        },
                        {
                            "accountNumber":data2.dataBody.계좌번호,
                            "bankGbn":"신한은행",
				            "accountGbn":"pension",
                            "accountName":data2.dataBody.계좌명,
                            "accountBalance":data2.dataBody.세금우대약정금액.replace( /,/gi, '')
                        },
                        {
                            "accountNumber":"285122094573",
                            "bankGbn":"신한은행",
				            "accountGbn":"fund",
                            "accountName":"리디파인K200펀드",
                            "accountBalance":"2150000"
                        },
                        {
                            "accountNumber":"288127722012",
                            "bankGbn":"신한은행",
				            "accountGbn":"fund",
                            "accountName":"중국CSI300펀드",
                            "accountBalance":"2400000"
                        },
                    ]
                } 
            }
            callback(data3);
        })
    } else {
        return
    }
}

exports.main = (req, res) => {
    config.printApiLog(1, config.card_url + "/v1/usecreditcard/searchusefordomestic", 1);
    config.printApiLog(1, config.card_url + "/v1/usedebitcard/searchusefordomestic", 1);
    config.printApiLog(1, config.life_url + "/v1/contract/list", 1);
    config.printApiLog(1, config.invest_url + "/v1/stock/remq", 1);
    config.printApiLog(1, config.bank_url + "/v1/account/fund/detail", 1);
    config.printApiLog(1, config.bank_url + "/v1/account/deposit/detail", 1);

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

    var postBodyInsurance = {
        "dataBody": {
            "rdreNo":"WmokLBDCO9/yfihlYoJFyg=="
         }
    }

    var postOptionInsurance = {
        header: postHeader
        , url: config.life_url + "/v1/contract/list"
        , method: "POST"
        , body: JSON.stringify(postBodyInsurance)
    };

    var postBodyInvest = {
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

    var postOptionInvest = {
        header: postHeader
        , url: config.invest_url + "/v1/stock/remq"
        , method: "POST"
        , body: JSON.stringify(postBodyInvest)
    }
    var postBodyFund = {
        "dataBody": {
            "거래구분":"1",
            "계좌번호":"250132675998",
            "은행구분":"1",
            "미기장거래":"1",
            "직원조회":"1",
            "정렬구분":"2"
        }   
    };

    var postOptionFund = {
        header: postHeader
        , url: config.bank_url + "/v1/account/fund/detail"
        , method: "POST"
        , body: JSON.stringify(postBodyFund)
    }
    var postBodyDeposit = {
        "dataBody": {
            "serviceCode":"D1130",
            "정렬구분":"1",
            "조회시작일":"20190228",
            "조회종료일":"20190830",
            "조회기간구분":"1",
            "은행구분":"1",
            "계좌번호":"230221966424"
        }
    };

    var postOptionDeposit = {
        header: postHeader
        , url: config.bank_url + "/v1/account/deposit/detail"   
        , method: "POST"
        , body: JSON.stringify(postBodyDeposit)
    };

    async.waterfall([
        function(callback) {
            config.printApiLog(2, config.card_url + "/v1/usecreditcard/searchusefordomestic", 1);
            request.post(postOption, function(error, httpResponse, body) { //체크카드내역
                if (error) {
                    console.log(error); 
                    return;
                } 
                config.printApiLog(3, config.card_url + "/v1/usecreditcard/searchusefordomestic", 1);
                var json_body = JSON.parse(body);
                config.printDataLog(json_body)
                callback(null, json_body);
            });
        },
        function(checkcard_data, callback) {
            config.printApiLog(2, config.card_url + "/v1/usedebitcard/searchusefordomestic", 1);
            request.post(postOption2, function(error, httpResponse, body) { //신용카드내역
                if (error) {
                    console.log(error); 
                    return;
                } 
                config.printApiLog(3, config.card_url + "/v1/usedebitcard/searchusefordomestic", 1);
                var json_body = JSON.parse(body);
                config.printDataLog(json_body)
                callback(null,checkcard_data, json_body);
            });
        },
        function(checkcard_data,creditcard_data, callback) {
            config.printApiLog(2, config.life_url + "/v1/contract/list", 1);
            request.post(postOptionInsurance, function(error, httpResponse, body) { //보험
                if (error) {
                    console.log(error); 
                    return;
                } 
                config.printApiLog(3, config.life_url + "/v1/contract/list", 1);
                var json_body = JSON.parse(body);
                config.printDataLog(json_body)
                callback(null,checkcard_data, creditcard_data, json_body);
            });
        },
        function(checkcard_data, creditcard_data, insurance_data, callback) {
            config.printApiLog(2, config.invest_url + "/v1/stock/remq", 1);
            request.post(postOptionInvest, function(error, httpResponse, body) { //주식 - 직접투자
                if (error) {
                    console.log(error); 
                    return;
                } 
                config.printApiLog(3, config.invest_url + "/v1/stock/remq", 1);
                var json_body = JSON.parse(body);
                config.printDataLog(json_body)
                callback(null,checkcard_data, creditcard_data, insurance_data, json_body);
            });
        },
        function(checkcard_data, creditcard_data, insurance_data, invest_data, callback) {
            config.printApiLog(2, config.bank_url + "/v1/account/fund/detail", 1);
            request.post(postOptionFund, function(error, httpResponse, body) { //펀드 - 간접투자
                if (error) {
                    console.log(error); 
                    return;
                } 
                config.printApiLog(3, config.bank_url + "/v1/account/fund/detail", 1);
                var json_body = JSON.parse(body);
                config.printDataLog(json_body)
                callback(null,checkcard_data, creditcard_data, insurance_data, invest_data, json_body);
            });
        },
        function(checkcard_data, creditcard_data, insurance_data, invest_data, fund_data, callback) { //디파짓(청약)
            config.printApiLog(2, config.bank_url + "/v1/account/deposit/detail", 1);
            request.post(postOptionDeposit, function(error, httpResponse, body) {
                if (error) {
                    console.log(error); 
                    return;
                } 
                var tt = insurance_data.dataBody.retrieveInonList.retrieveCyberCstConMattCyberCstMattListDTO.retrieveCyberCstConMattCyberCstMattDTO;
                const sumInpFe = tt[0].sumInpFe;
                var sumInvest = "0"
                for (var i = 0; i < invest_data.dataBody.list.length; i++) {
                    var temp = parseInt(invest_data.dataBody.list[i].evlt_amt)
                    sumInvest = parseInt(sumInvest) + temp;
                }
                config.printApiLog(3, config.bank_url + "/v1/account/deposit/detail", 1);
                var json_body = JSON.parse(body);//디파짓
                config.printDataLog(json_body)
                const yunSum = fund_data.dataBody.세금우대약정금액.replace( /,/gi, '')

                //console.log(body)
                maindataMerge(hpno, checkcard_data, creditcard_data, insurance_data, invest_data, fund_data,json_body,sumInpFe ,sumInvest,yunSum, function(data) {
                    res.json(data);
                    config.printApiLog(4, config.card_url + "/v1/usecreditcard/searchusefordomestic", 1);
                    config.printApiLog(4, config.card_url + "/v1/usedebitcard/searchusefordomestic", 1);
                    config.printApiLog(4, config.life_url + "/v1/contract/list", 1);
                    config.printApiLog(4, config.invest_url + "/v1/stock/remq", 1);
                    config.printApiLog(4, config.bank_url + "/v1/account/fund/detail", 1);
                    config.printApiLog(4, config.bank_url + "/v1/account/deposit/detail", 1);
                });
            });
            // res.json(data);
        }
    ]);
    
}

function maindataMerge(hpno, checkcard_data, creditcard_data, insurance_data, inverst_data, fund_data,deposit_data, sumInpFe,sumInvest,yunSum,callback) {
    
    if (checkcard_data.dataHeader.successCode == "0" && creditcard_data.dataHeader.successCode == "0"){
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
                    "checkCardTotalAmount": "3056163",
                    "creditCardTotalAmount": "6694500",
                    "cashTotalAmount": "1762672",
                    "cultureTotalAmount": "689500",
                    "publicTransferTotalAmount" : "379500",
                    "deductInsuranceTotalAmount" : "1500000",//보장성 보험 납입금액
                    "fundTotalAmount" : "4550000",//펀드
                    "investTotalAmount" : sumInvest,//주식
                    "yumTotalAmount" : yunSum,//연금저축,
                    "chungyakTotalAmount" : "2400000",//청약
                    "IRPTotalAmount" : "0"//IRP
                } 
            }
            callback(data3);
        })
    } else {
        return
    }
}