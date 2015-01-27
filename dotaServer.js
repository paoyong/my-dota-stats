var http = require('http');
var fs = require('fs');
var jsdom = require('jsdom');

/* Dota modules */
var matchDetails = require('./getMatchJSONFromId');
var dotadb = require('./dotadb');

var port = 8888;

/* Digital Ocean server port */
var ip = '104.131.118.167';

/* Comment this line when deploying to Git and the server */
//var ip = 'localhost';

/* Start the server */
var server = http.createServer(function (req, res) {
    console.log("Recieved request: " + req.url);
    if (req.url === '/') {
        call_jsdom("index.html", function(window) {
            var $ = window.$;
            dotadb.getLatestDotaMatch(function(match) {
                console.log("Found latest match! Match: " + match);
                var hours = matchDetails.getHoursSinceGameWasPlayed(match.match_time, match.match_duration).toFixed(1);
                console.log("Found the latest match: " + match.match_id);
                
                /* Write to the HTML file with JQuery */
                res.writeHead(202, {'Content-Type': 'text/html'});
                $("#hours_ago").text(hours);
                res.end("<!DOCTYPE html>\n" + $('html').html());
            });
        });
    } else {
        /* End the request if it's something other than '/' */
        res.end();
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
