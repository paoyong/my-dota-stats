/* getMyLatestMatchId.js
 *
 * Grabs the match_id of the latest game I played and returns it in the callback function. */

var https = require('https'),
    config = require('./config.js'),
    myFirstLatestMatchURL = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?matches_requested=1&key=' + config.steam_api_key + '&account_id=' + config.dota_account_id,
    latestMatchId = 0;

module.exports = function(callback) {
    https.get(myFirstLatestMatchURL, function(res) {
        console.log(myFirstLatestMatchURL);
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            var responseJSON = JSON.parse(body);
            latestMatchId = responseJSON.result.matches[0].match_id;
            console.log(latestMatchId);
            callback(latestMatchId);
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
    });
};
