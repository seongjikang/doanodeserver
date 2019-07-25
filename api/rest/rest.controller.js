var quertyString = require('querystring');

exports.index = (req, res) => {
    // res.json(users);
    console.log('rest controller test');
    console.log(req);
    // console.log(res);
    res.send('test');
};

// http://10.25.143.72:3000/rest/callback?code=c977385a-dfb6-4a96-95aa-4c027e28041f&scope=login+transfer+inquiry&client_info=OpenSOL_AND
exports.callback = (req, res) => {
    var code = req.query.code;
    var scope = req.query.scope;
    var client_info = req.query.client_info;

    var gObj = quertyString.parse(req);

    console.log('code = ' + code);
    console.log('scope = ' + scope);
    console.log('client_info = ' + client_info);

    res.end();
};