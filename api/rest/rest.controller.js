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
        // console.log("");
        // console.log(data.access_token);
        res.json(data);
    });
};

exports.userme = (req, res) => {
    // req.accepts('application/json');

    // if (req != null) {
    //     // key = req.body;
    //     // value = JSON.stringify(req.body);
    //     // console.log("value = " + value);
    //     console.log("user = " + req.params);
    //     console.log("user = " + req.params.user);
    // }

    // hgetRData("mng_access_token", "user1", function(data) {
    //     console.log(data);
    //     // console.log("");
    //     // console.log(data.access_token);
    //     res.json(data);
    // });

    const user = parseInt(req.params.user, 10);
    if (!user) {
        console.log("user is none")
        user = "1100035016";
    }

    // let user = users.filter(user => user.id === id)[0]
    // if (!user) {
        // return res.status(404).json({error: 'Unknown user'});
    // }

    // console.log(user);

    // return res.json(user);
    hgetRData("mng_access_token", "user1", function(data) {
        // console.log(data);
        // console.log("");
        // console.log(data.access_token);
        // res.json(data);
        return res.json(getUserMe(data.access_token, user));
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
function getUserMe(access_token, user_seq_no) {
    // console.log('access_token = ' + access_token);
    // console.log('user_seq_no = ' + user_seq_no);
    if (access_token != null && user_seq_no != null) {
        var getHeader = {
            "Authorization": "Bearer " + access_token
        }

        var option = {
            headers: getHeader
            , url: config.ob_url + config.user + "?" + "user_seq_no=" + user_seq_no 
        }

        // console.log(option);

        request.get(option, function(err, response, body) {
            if (err) console.log(err);
            
            // console.log(res.statusCode);
            var json_body = JSON.parse(body);
            console.log(json_body);
            return json_body;
            // hsetRdata("mng_access_token", "user1", JSON.stringify(json_body));
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
            hsetRdata("mng_access_token", "user1", JSON.stringify(json_body));
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
    var tField = "obj." + field;

    client.hgetall(key, function(err, obj) {
        if (err) console.log(err);
        var res = JSON.parse(eval(tField));
        callback(res);
    });
}

// Redis JSON 데이터 set
// Key와 Field에 val(json)을 저장
function hsetRdata(key, field, val) {
    client.hset(key, field, val);
}