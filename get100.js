// TODO
// 1. Actually callback the JSON instead of printing it out
// 2. Implement the JSON to return.
var request = require('request');
var dateBucket = require('./dateBucket.js');
var config = require('./config.js');

var url = 'https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?&key=' + config.steam_api_key + '&account_id=' + config.dota_account_id;

var cutoff = 11,
    ret = {};

var req_from_api = function(start_match_id) {
    request({
        url: url + '&start_match_at_id=' + start_match_id,
        json: true
    }, function(error, response, body) {
        if (error) {
            console.log("Error found! :" + err);
        } else {
            parse_json(body);
        }
    });
};

var parse_json = function(json) {
    var i = 0,
        matches = json.result.matches,
        days_ago = 0,
        get_more = true;

    for (i in matches) {
        days_ago = dateBucket.getDaysAgoFromUnixTime(matches[i].start_time);
        if (days_ago <= cutoff) {
            console.log(matches[i].match_id);
        } else {
            get_more = false;
        }
    }

    // WARNING: This will only call whenever I play more than 100 matches in the last 12 days! Behavior is potentially buggy! The i == 99 part means that the Dota API call still has more matches to go. I'm just not sure how to test it out.
    if (get_more === true && i == 99) {
        req_from_api(matches[i] - 1);
    } else {
    }
};

req_from_api(0);
