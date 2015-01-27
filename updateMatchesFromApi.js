/* updateMatchesFromApi.js
 *
 * Meant to be run as a daemon. Updates the dota database with new matches
 * from the Dota API, every [refresh_minutes] minutes. Doesn't actually get the JSON,
 * it uses the JSON that getMatchDetailsFromId.js gives */
var async = require('async');
var getMyLatestMatch = require('./getMyLatestMatchId');
var matchDetails = require('./getMatchJSONFromId');
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
            function(match_json) {
                /* Get all the information to add to a single DB entry */
                var id = match_json.result.match_id;
                var start_time = match_json.result.start_time;
                var duration = match_json.result.duration;

                /* Add to the database */
                dotadb.addDotaMatch(id, start_time, duration);
            }
        ]);
    });
    setTimeout(updateMatchId, interval_ms);
}

/* Jump start updateMatchId */
updateMatchId();
