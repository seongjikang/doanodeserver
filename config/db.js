// Redis Setup
const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');

// Redis 단일 데이터 get
module.exports.getRData = function getRData(key, callback) {
    client.get(key, function(err, res) {
        if (err) {
            console.log(err);
        } else {
            callback(res);
        }
        
    });
};

// Redis 단일 데이터 set
module.exports.setRData = function(key, val) {
    client.set(key, val, redis.print);
}

// Redis JSON 데이터 get
// Key와 Field를 요청하면 조건에 맞는 JSON Data를 Return
module.exports.hgetRData = function(key, field, callback) {
    client.hget(key, field, function(err, obj) {
        if (err) console.log(err);
        // var res = JSON.parse(obj);
        var res = obj;
        callback(res);
    });
}

// Redis JSON 데이터 get
// Key를 요청하면 조건에 맞는 JSON Data를 Return
module.exports.hgetallRData = function(key, callback) {
    client.hgetall(key, function(err, obj){
        if (err) console.log(err);
        var res = obj;
        callback(res);
    });
}

// Redis JSON 데이터 set
// Key와 Field에 val(json)을 저장
module.exports.hsetRdata = function(key, field, val) {
    client.hset(key, field, val);
}

module.exports.setexRData = function(key, second, val) {
    client.setex(key, second, val, redis.print);
}