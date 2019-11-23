// Shinhan Hackathon
const bank_url = "http://10.3.17.61:8080";
const card_url = "http://10.3.17.61:8081";
const invest_url = "http://10.3.17.61:8082";
const life_url = "http://10.3.17.61:8083";

exports.bank_url = bank_url;
exports.card_url = card_url;
exports.invest_url = invest_url;
exports.life_url = life_url;

module.exports.printApiLog = function(direction, apiName, status) {
    var dir = "";
    switch (direction) {
        case 1:
            dir = "[APP -> DOA] " 
            break;
        case 2:
            dir = "[DOA -> Shinhan] " 
            break;
        case 3:
            dir = "[Shinahn -> DOA] " 
            break;
        case 4:
            dir = "[DOA -> APP] " 
            break;
    }

    apiName = "[API : " + apiName + "] "

    var stat = "";
    switch (status) {
        case 1:
            stat = "[성공]"
            break
        case 2:
            stat = "[실패]"
            break  

    }
    console.log(dir + apiName + stat);
    if (direction == 4) console.log("\n");
}

module.exports.printDataLog = function(message) {
    console.log("-------------------------------- RESPONSE DATA --------------------------------");
    console.log(message);
    console.log("-------------------------------- RESPONSE DATA --------------------------------");
}
