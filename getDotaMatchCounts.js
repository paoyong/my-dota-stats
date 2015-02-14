// I'm just gonna limit this to 100 matches in the past 12 days.
// This js serves /dota-match-counts
var request = require('request');
var dateBucket = require('./dateBucket.js');
var config = require('./config.js');

var url = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?&key=' + config.steam_api_key + '&account_id=' + config.dota_account_id;

function createDateBucketJSON(days) {
    var new_json = {};
    for (var i = 0; i <= days; i++) {
        new_json[i] = 0;
    }
    return new_json;
}
function parseJSON(json, days_ago, callback) {
    var date_bucket_JSON = createDateBucketJSON(days_ago),
        matches_array = json.result.matches,
        cutoff_seconds = (new Date().getTime() / 1000) - (days_ago * 24 * 60 * 60),
        curr_match_days_ago = 0;

    for (var i in matches_array) {
        if (cutoff_seconds <= matches_array[i].start_time) {
            curr_match_days_ago = dateBucket(matches_array[i].start_time);
            date_bucket_JSON[curr_match_days_ago]++;
        }
    }
    callback(date_bucket_JSON);
}

function makeRequestToMatchHistory(url, days_ago, callback) {
    request({
        url: url,
        json: true
    }, function(error, response, body) {
        if (error) {
            console.log('Error found: ' + error);
        } else {
            parseJSON(body, days_ago, callback);
        }
    });
}

function getLatestMatchesJSON(days, callback) {
    var final_json;
    days = days - 1;

    makeRequestToMatchHistory(url, days, function(dota_api_json) {
        callback(dota_api_json);
    });
}

module.exports = getLatestMatchesJSON;
