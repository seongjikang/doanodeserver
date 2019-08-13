var quertyString = require('querystring');

const redis = require('redis');
const client = redis.createClient(6379, '127.0.0.1');
const JSON = require('JSON');

client.on('connect', () => {
    console.log('Redis Connected!');
    // getDefaultData();
});

client.on('error', (err) => {
    console.log('Unable to connect to Redis Server');
});

exports.index = (req, res) => {
    req.accepts('application/json');

    var key, value;

    if (req != null) {
        key = req.body;
        value = JSON.stringify(req.body);
    }

    console.log('value = ' + value);
    
    client.set('color', 'red', redis.print);

    if (value != null) {
        // req.cache.set(key, value, function(err, data) {
        client.set(key, value, function(err, data) {
            if (err) {
                console.log(err);
                res.send("error " + err);
                return;
            }
            
            // req.cache.expire(key, 10);
            client.expire(key, 10);
            res.json(value);
            //console.log(value);
        });
    }
};

exports.setname = (req, res) => {
    console.log("/profile/:name");
    var key = req.params.name;
    
    req.cache.get(key,function(err, data) {
        if (err) {
            console.log(err);
            res.send("error " + err);
            return;
        }
        
        var value = JSON.parse(data);
        res.json(value);
    });
};

function getDefaultData() {
    client.hgetall('C001', (error, object) => {
        // console.log(object);
    });
}