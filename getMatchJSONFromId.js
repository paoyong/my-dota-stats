/* Functions for parsing JSON of a single Dota 2 match, given match_id */

var https = require('https');
var apiURL;
var latestMatchId = undefined;

module.exports = {
    getMatchDetailsFromId: function(match_id, callback) {
        apiURL = "https://api.steampowered.com/IDOTA2Match_570/GetMatchDetails/V001/?match_id=" + match_id + "&key=29270A858787255DA9648F82763CBB35";
        https.get(apiURL, function(res) {
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                var responseJSON = JSON.parse(body);
                callback(responseJSON);
            });
        }).on('error', function(e) {
            console.log("Got error: ", e);
        });
    },
    /* A helper function to return hours since game played as a long float */
    getHoursSinceGameWasPlayed: function(match_start_time, match_duration) {
        var hours;
        hours = (new Date().getTime() / 1000) - match_start_time + match_duration;
        hours = (hours / 60 / 60);
        return hours;
    }
}
