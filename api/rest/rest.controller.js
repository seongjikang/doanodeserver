const config = require('../../config/config.js');

var quertyString = require('querystring');
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');
const JSON = require('JSON');

const request = require('request');

exports.index = (req, res) => {
    req.accepts('application/json');
    var key, value;

    if (req != null) {
        key = req.body;
        value = JSON.stringify(req.body);
    }

    hgetRData("mng_access_token", "user1", function(data) {
        console.log(data);
        console.log("");
        console.log(data.access_token);
    });

    // Redis Test Start
    // var tmpData = {"userid":"hihiID",
    //        "pass":"hihiPass",
    //        "email":"hihi@naver.com",
    //        "feature":"student"};
    // var insertData = JSON.stringify(tmpData);

    // // client.hset("kor_userInfo","user1",JSON.stringify(insertData));
    // // client.hset("kor_userInfo","user1", insertData);
    // hsetRdata("kor_userInfo", "user2", insertData);
    // // client.hset("kor_userInfo","user1",tmpData);

    // hgetRData("kor_userInfo", "user2", function(data) {
    //     console.log(data);
    // });

    // setRData("key1", "key2");
    // getRData("key3", function(res) {
    //     console.log("res = " + res);
    // });

    // client.get('ta_code', function(err, res) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     getToken(res);
    // })
    // Redis Test End
};

// http://10.25.143.72:3000/rest/callback?code=c977385a-dfb6-4a96-95aa-4c027e28041f&scope=login+transfer+inquiry&client_info=OpenSOL_AND
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
            
            console.log(res.statusCode);
            var json_body = JSON.parse(body);
            hsetRdata("mng_access_token", "user1", JSON.stringify(json_body));
        });
    }
}

function getRData(key, callback) {
    console.log("<Redis> getRData()");
    client.get(key, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            callback(res);
        }
        
    });
}

function setRData(key, val) {
    console.log("<Redis> setRData()");
    client.set(key, val, redis.print);    
}

// Key와 Field를 요청하면 조건에 맞는 JSON Data를 Return
function hgetRData(key, field, callback) {
    console.log("<Redis> hgetRData()");
    var tField = "obj." + field;

    client.hgetall(key, function(err, obj) {
        if (err) console.log(err);
        var res = JSON.parse(eval(tField));
        callback(res);
    });
}

// Key와 Field에 val(json)을 저장
function hsetRdata(key, field, val) {
    console.log("<Redis> hsetRdata()");
    client.hset(key, field, val);
}