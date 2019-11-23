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

exports.lifeUsage = (req, res) => {
    config.printApiLog(1, config.life_url + "/v1/contract/list" , 1);
    const hpno = req.body.hpno;
    if (!hpno) {
        console.log("hpno is none");
        res.json("hpno is none");
        return
    };

    var postHeader = {
        "Content-Type" : "application/json; charset=UTF-8"
    }

    var postBody = {
        "dataBody": {
            "rdreNo":"WmokLBDCO9/yfihlYoJFyg=="
         }
    }

    var postOption = {
        header: postHeader
        , url: config.life_url + "/v1/contract/list"
        , method: "POST"
        , body: JSON.stringify(postBody)
    };
    config.printApiLog(2, config.life_url + "/v1/contract/list" , 1);
    request.post(postOption, function(error, response, body) {
        if (error) {
            console.log(error); 
            return;
        } 

        var json_body = JSON.parse(body);
        config.printApiLog(3, config.life_url + "/v1/contract/list" , 1);
        config.printDataLog(json_body)
        var tt = json_body.dataBody.retrieveInonList.retrieveCyberCstConMattCyberCstMattListDTO.retrieveCyberCstConMattCyberCstMattDTO;
        const lifename = tt[0].intyNm;
        const sumInpFe = tt[0].sumInpFe;
        const successcd = json_body.dataHeader.SuccessCode;
        dataMerge(hpno,lifename, sumInpFe, successcd, function(data) {
            res.json(data);
            config.printApiLog(4, config.life_url + "/v1/contract/list" , 1);
        });
    });
}

function dataMerge(hpno, lifename, sumInpFe,successcd, callback) {
    if (successcd == "0") {
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
                    "insuranceList": [
                        { 
                            "lifename": lifename, 
                            "sumInpFe": sumInpFe, 
                            "isDeduction":"0" ,
                            "description":"무배당 신한 아이사랑 보험 [갱신형]",
                            "amount":"1500000"
                        },
                        {
                            "lifename":"신한연금저축보험",
                            "sumInpFe":"2680000",
                            "isDeduction":"1",
                            "description":"무배당 신한연금저축보험",
                            "amount":"578000"
                        }
                    ]
                   
                } 
            }
            callback(data3);
        })
    } else {
        return
    }
}

//기민주의 전통시장,박물관 등등
exports.culturePayment = (req, res) => {
    config.printApiLog(1, "culturePayment" , 1);
    const hpno = req.body.hpno;
    if (!hpno) {
        console.log("hpno is none");
        res.json("hpno is none");
        return
    };

    const successcd = "0"
    dataMergeCulture(hpno, successcd, function(data) {
        res.json(data);
        config.printApiLog(4, "culturePayment" , 1);
    });
}

function dataMergeCulture(hpno, successcd, callback) {
    if (successcd == "0") {
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
                    "totalcnt": "20",
			        "totalamount": "689500",
                    "traditionalList": [
                        {   "month": "1",
	                "cnt": "5",
	                "amount": "78500",
	                "afterExceptAmount": "78500",
	                "exceptCnt": "0",
	            },{   "month": "3",
	                "cnt": "4",
	                "amount": "17000",
	                "afterExceptAmount": "17000",
	                "exceptCnt": "0",
	            },{   "month": "7",
	                "cnt": "2",
	                "amount": "22000",
	                "afterExceptAmount": "22000",
	                "exceptCnt": "0",
	            },{   "month": "9",
		              "cnt": "6",
		              "amount": "47000",
		              "afterExceptAmount": "47000",
		              "exceptCnt": "0",
		            },{   "month": "10",
	                "cnt": "6",
	                "amount": "47000",
	                "afterExceptAmount": "47000",
	                "exceptCnt": "0",
	            },{   "month": "11",
	                "cnt": "3",
	                "amount": "25000",
	                "afterExceptAmount": "25000",
	                "exceptCnt": "0",
	            }
                    ]
                   
                } 
            }
            callback(data3);
        })
    } else {
        return
    }
}

exports.cash = (req, res) => {
    config.printApiLog(1, "cash" , 1);
    const hpno = req.body.hpno;
    if (!hpno) {
        console.log("hpno is none");
        res.json("hpno is none");
        return
    };

    const successcd = "0"
    dataMergecash(hpno,successcd,function(data) {
        res.json(data);
        config.printApiLog(4, "cash" , 1);
    });
}

function dataMergecash(hpno,successcd, callback) {
    if (successcd == "0") {
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
                    "totalcnt": "60",
                    "totalamount": "1762672",
                    "cashList": [
                        {"month": "1",
	                "cnt": "9",
	                "amount": "133389",
	                "afterExceptAmount": "133389",
	                "exceptCnt": "0",
	            },{   "month": "2",
	                "cnt": "11",
	                "amount": "141800",
	                "afterExceptAmount": "141800",
	                "exceptCnt": "0",
	            },{   "month": "3",
	                "cnt": "4",
	                "amount": "17300",
	                "afterExceptAmount": "17300",
	                "exceptCnt": "0",
	            },{   "month": "4",
	                "cnt": "5",
	                "amount": "131700",
	                "afterExceptAmount": "131700",
	                "exceptCnt": "0",
	            },{   "month": "5",
	                "cnt": "7",
	                "amount": "32400",
	                "afterExceptAmount": "32400",
	                "exceptCnt": "0",
	            },{   "month": "6",
	                "cnt": "2",
	                "amount": "33",
	                "afterExceptAmount": "33",
	                "exceptCnt": "0",
	            },{   "month": "7",
	                "cnt": "3",
	                "amount": "60700",
	                "afterExceptAmount": "60700",
	                "exceptCnt": "0",
	            },{   "month": "8",
	                "cnt": "3",
	                "amount": "800000",
	                "afterExceptAmount": "800000",
	                "exceptCnt": "0",
	            },{   "month": "9",
	                "cnt": "10",
	                "amount": "115550",
	                "afterExceptAmount": "115550",
	                "exceptCnt": "0",
	            },{   "month": "10",
	                "cnt": "4",
	                "amount": "126700",
	                "afterExceptAmount": "126700",
	                "exceptCnt": "0",
	            },{   "month": "11",
	                "cnt": "2",
	                "amount": "203100",
	                "afterExceptAmount": "203100",
	                "exceptCnt": "0",
	            }
                    ]
                } 
            }
            callback(data3);
        })
    } else {
        return
    }
}

exports.publicTransfer = (req, res) => {
    config.printApiLog(1, "publicTransfer" , 1);
    const hpno = req.body.hpno;
    if (!hpno) {
        console.log("hpno is none");
        res.json("hpno is none");
        return
    };

    const successcd = "0"
    dataMergePublicTransfer(hpno, successcd,function(data) {
        res.json(data);
        config.printApiLog(4, "publicTransfer" , 1);
    });
}

function dataMergePublicTransfer(hpno, successcd,callback) {
    if (successcd == "0") {
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
                    "totalcnt": "251",
			        "totalamount": "379500",
                    "publicTransferlList": [
                        {   "month": "1",
	                "cnt": "40",
	                "amount": "23000",
	                "afterExceptAmount": "23000",
	                "exceptCnt": "0",
	            },{   "month": "2",
	                "cnt": "60",
	                "amount": "45000",
	                "afterExceptAmount": "45000",
	                "exceptCnt": "0",
	            },{   "month": "3",
	                "cnt": "10",
	                "amount": "89000",
	                "afterExceptAmount": "89000",
	                "exceptCnt": "0",
	            },{   "month": "4",
		              "cnt": "42",
		              "amount": "10800",
		              "afterExceptAmount": "10800",
		              "exceptCnt": "0",
		            },{   "month": "5",
	                "cnt": "55",
	                "amount": "21000",
	                "afterExceptAmount": "21000",
	                "exceptCnt": "0",
	            },{   "month": "6",
	                "cnt": "22",
	                "amount": "23000",
	                "afterExceptAmount": "23000",
	                "exceptCnt": "0",
	            },{   "month": "7",
	                "cnt": "3",
	                "amount": "43000",
	                "afterExceptAmount": "43000",
	                "exceptCnt": "0",
	            },{   "month": "8",
	                "cnt": "3",
	                "amount": "69000",
	                "afterExceptAmount": "69000",
	                "exceptCnt": "0",
	            },{   "month": "9",
	                "cnt": "10",
	                "amount": "20800",
	                "afterExceptAmount": "20800",
	                "exceptCnt": "0",
	            },{   "month": "10",
	                "cnt": "4",
	                "amount": "26000",
	                "afterExceptAmount": "26000",
	                "exceptCnt": "0",
	            },{   "month": "11",
	                "cnt": "2",
	                "amount": "8900",
	                "afterExceptAmount": "8900",
	                "exceptCnt": "0",
	            }
                    ]
                   
                } 
            }
            callback(data3);
        })
    } else {
        return
    }
}

exports.searchInsurance = (req, res) => {
    config.printApiLog(1, "searchInsurance" , 1);
    const hpno = req.body.hpno;
    if (!hpno) {
        console.log("hpno is none");
        res.json("hpno is none");
        return
    };

    const successcd = "0"
    search(hpno, successcd,function(data) {
        res.json(data);
        config.printApiLog(4, "searchInsurance" , 1);
    });
}

function search(hpno, successcd, callback) {
    if (successcd == "0") {
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
                    "insuranceRecommandList": [
                        {
                           "intyNm":"신한실손의료비보장보험",
                           "inInfo":"종합 보장형, 질병 보장형, 상해 보장형"
                       }, {
                           "intyNm":"참좋은덴탈케어보험",
                           "inInfo":"주기적인 치아 건강 이력 관리, 개인별 맞춤형 보험"
                       }, {
                           "intyNm":"신한받고또받는생활비암보험",
                           "inInfo":"각종 암보장과 생활비 지급 보장"
                       }, {
                           "intyNm":"무배당신한라이프안심상해보험",
                           "inInfo":"갱신없이 최대 80세까지 보장, 재해로 인한 사망 또는 장해시 폭넓은 고액 보장"
                       }, {
                           "intyNm":"무배당VIP온가족안심상해보험",
                           "inInfo":"온가족을 대상으로하는 안심 상해보험"
                       }
                   ]
                } 
            }
            callback(data3);
        })
    } else {
        return
    }
}