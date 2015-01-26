var http = require('http');
var fs = require('fs');
var jsdom = require('jsdom');

/* Dota modules */
var getMyLatestMatch = require('./getMyLatestMatchId');
var matchDetails = require('./getMatchDetailsFromId');
var dotadb = require('./dotadb');

var port = 8888;
var ip = '104.131.118.167';
//var ip = 'localhost';

/* Start the server */
var server = http.createServer(function (req, res) {
    console.log("Recieved request: " + req.url);
    if (req.url === '/') {
        call_jsdom("index.html", function(window) {
            var $ = window.$;
            dotadb.getLatestDotaMatch(function(match) {
                console.log("Found the latest match: " + match.match_id);
                res.writeHead(202, {'Content-Type': 'text/html'});
                var hours = matchDetails.getHoursSinceGameWasPlayed(match.match_time).toFixed(1);
                $("#hours_ago").text(hours);
                res.end("<!DOCTYPE html>\n" + $('html').html());
            });
        });
    }
}).listen(port, ip);

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
