const client_id = "l7xxc4de3ee74d78468f8bd73a4c92cd96e6";
const client_secret = "29665ccaf40b46c79450a7b2ba29a94b";
const redirect_url = "http://10.25.143.72:3000/rest/callback";

// OPEN BANKING URL
const ob_url = "https://testapi.open-platform.or.kr";
const ob_url2 = "https://testapi.openbanking.or.kr";
const api_user = "/user/me";
const api_get_token = "/oauth/2.0/token";


exports.client_id = client_id;
exports.client_secret = client_secret;
exports.redirect_url = redirect_url;

exports.ob_url = ob_url;
exports.ob_url2 = ob_url2;
exports.user = api_user;
exports.getToken = api_get_token;
