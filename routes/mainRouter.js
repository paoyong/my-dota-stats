var express = require('express'),
    fs = require('fs'),
    config = require('../config.js'),
    matchDetails = require('../getMatchJSONFromId'),
    dotadb = require('../dotadb'),
    getDotaMatchCounts = require('../getDotaMatchCounts'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('index', { title: 'Keith\'s Dota Stats'});
});

// Respondes '/hours-played' with the number of hours played.
router.get('/hours-played', function(req, res) {
    dotadb.getLatestDotaMatch(function(match) {
        // Get the hours and format it nicely.
        var hours = matchDetails.getHoursSinceGameWasPlayed(match.match_time, match.match_duration).toFixed(1);

        // Respond to the GET with the hours variable.
        res.send(hours);
    });
});

router.get('/dota-match-counts', function(req, res){
    fs.readFile(config.dota_match_counts_json_filename, 'utf8', function (err, data) {
        res.json(JSON.parse(data));
    });
});

module.exports = router;
