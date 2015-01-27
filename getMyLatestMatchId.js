/* getMyLatestMatchId.js
 *
 * Grabs the match_id of the latest game I played and returns it in the callback function. */

var https = require('https');
var myFirstLatestMatchURL = "https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?matches_requested=1&account_id=94636820&key=29270A858787255DA9648F82763CBB35";
var latestMatchId = undefined;

module.exports = function(callback) {
    https.get(myFirstLatestMatchURL, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            var responseJSON = JSON.parse(body);
            latestMatchId = responseJSON.result.matches[0].match_id;
            callback(latestMatchId);
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
    });
};
