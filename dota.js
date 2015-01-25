var http = require('http');
var async = require('async');
var fs = requrie('fs');

/* Dota modules */
var getMyLatestMatch = require('./getMyLatestMatchId');
var matchDetails = require('./getMatchDetailsFromId');

var refresh_minutes = 30;
var interval_ms = refresh_minutes * 60 * 1000;

var id;
var hours_since_game;
var json;

var port = 8888;
var ip = '104.131.118.167'
var ip = 'localhost'

/* Start the server */
var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Keith\'s latest Dota matchid is ' + id + '. He played the game ' + hours_since_game + ' hours ago.');
}).listen(port, ip);

/* Updates match ID and hours since that match, every [refresh_minutes] */
function updateMatchId() {
    getMyLatestMatch(function(match_id) {
        id = match_id;
        
        async.waterfall([
            function(callback) {
                matchDetails.getMatchDetailsFromId(id, function(match_json) {
                    json = match_json;
                    callback(null, match_json);
                });
            },
            function(match_json) {
                hours_since_game = matchDetails.getHoursSinceGameWasPlayed(match_json);
                hours_since_game = parseFloat(hours_since_game).toFixed(1);
            }
        ]);
    });
    setTimeout(updateMatchId, interval_ms);
}

/* Jump start updateMatchId */
updateMatchId();
