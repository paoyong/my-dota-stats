var async = require('async');
var getMyLatestMatch = require('./getMyLatestMatchId');
var matchDetails = require('./getMatchDetailsFromId');
var dotadb = require('./dotadb');

var refresh_minutes = 5;
var interval_ms = refresh_minutes * 60 * 1000;


/* Updates match ID and hours since that match, every [refresh_minutes] 
 * Also updates index.html */
function updateMatchId() {
    getMyLatestMatch(function(match_id) {
        id = match_id;
        
        console.log("Grabbing any new matches from the Dota API.");
        async.waterfall([
            function(callback) {
                matchDetails.getMatchDetailsFromId(id, function(match_json) {
                    json = match_json;
                    callback(null, match_json);
                });
            },
            function(match_json, callback) {
                hours_since_game = matchDetails.getHoursSinceGameWasPlayed(match_json);
                hours_since_game = parseFloat(hours_since_game).toFixed(1);
                dotadb.addDotaMatch(match_json.result.match_id, match_json.result.start_time);
                callback(null, hours_since_game);
            }
        ]);
    });
    setTimeout(updateMatchId, interval_ms);
}

/* Jump start updateMatchId */
updateMatchId();