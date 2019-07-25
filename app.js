const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser')

// Redis Session Manage

// const session = require('express-session');
// const connectRedis = require('connect-redis');
// const RedisStore = connectRedis(session);
// const sess = {
//     resave: false,
//     saveUninitialized: false,
//     // secret: sessionSecret,
//     // name: sessionId,
//     cookie: {
//         httpOnly: true,
//         secure: false
//     },
//     store: new RedisStore({url: '레디스 호스팅 주소', logErrors: true})
// };

// app.use(session(sess));

// Redis Example

// var redis = require('redis');
// var JSON = require('JSON');
// client = redis.createClient(6379, '127.0.0.1');

// app.use(function(req, res) {
//     req.cache = client;
//     // next();
// });

// app.post('/profile', function(req, res) {
//     req.accepts('application/json');

//     var key = req.body.name;
//     var value = JSON.stringify(req.body);

//     req.cache.set(key, value, function(err, data) {
//         if (err) {
//             console.log(err);
//             res.send("error " + err);
//         }
//         req.cache.expire(key, 10);
//         res.json(value);
//         console.log(value);
//     }); 
// });

// app.get('/profile/:name', function(req, res) {
//     var key = req.param.name;

//     req.cache.get(key, function(err, data) {
//         if (err) {
//             console.log(err);
//             res.send("error " + err);
//             return;
//         }

//         var value = JSON.parse(data);
//         res.json(value);
//     });
// });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./api/users'));
app.use('/rest', require('./api/rest'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));