var http = require('http');
var async = require('async');
var fs = require('fs');
var jsdom = require('jsdom');

/* Dota modules */
var getMyLatestMatch = require('./getMyLatestMatchId');
var matchDetails = require('./getMatchDetailsFromId');

var refresh_minutes = 30;
var interval_ms = refresh_minutes * 60 * 1000;

var id;
var hours_since_game;
var json;

var port = 8888;
var ip = '104.131.118.167';

/* Start the server */
var server = http.createServer(function (req, res) {
    console.log("Recieved request: " + req.url);
    
    /* On a request, read the HTML file */
    call_jsdom("index.html", function(window) {
        var $ = window.$;
        $("#hours_ago").text(hours_since_game + '');
        res.writeHead(202, {'Content-Type': 'text/html'});
        res.end("<!DOCTYPE html>\n" + $('html').html());
    });
}).listen(port, ip);

/* Updates match ID and hours since that match, every [refresh_minutes] 
 * Also updates index.html */
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
            function(match_json, callback) {
                hours_since_game = matchDetails.getHoursSinceGameWasPlayed(match_json);
                hours_since_game = parseFloat(hours_since_game).toFixed(1);
                callback(null, hours_since_game);
            }, 
            function(hours_since_game) {
            }
        ]);
    });
    setTimeout(updateMatchId, interval_ms);
}

function call_jsdom(source, callback) {
    jsdom.env(
            source,
            ['jquery-2.1.3.js'],
            function(errors, window) {
                process.nextTick(
                function() {
                    if (errors) {
                        throw new Error("There were errors: " + errors);
                    }
                    callback(window);
                }
            );
        }
    );
}
/* Jump start updateMatchId */
updateMatchId();
