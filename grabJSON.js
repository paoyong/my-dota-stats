/* updateMatchesFromApi.js
 *
 * Meant to be run as a daemon. Updates the dota database with new matches
 * from the Dota API, every [refresh_minutes] minutes. Doesn't actually get the JSON,
 * it uses the JSON that getMatchDetailsFromId.js gives */
var async = require('async'),
    fs = require('fs'),
    getDotaMatchCounts = require('./getDotaMatchCounts'),
    config = require('./config'),
    dota_json_filename = config.dota_match_counts_json_filename,
    refresh_minutes = config.refresh_minutes,
    interval_ms = refresh_minutes * 60 * 1000;

/* Updates match ID and hours since that match, every [refresh_minutes] 
 * Also updates index.html */
module.exports = function(callback) {
    // Grab the latest matches JSON and store it in local file.
    getDotaMatchCounts(config.days, function(json) {
        callback(json);
    });
}
