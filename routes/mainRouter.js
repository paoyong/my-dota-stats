var express = require('express'),
    router = express.Router(),
    /* Custom modules */
    matchDetails = require('../getMatchJSONFromId'),
    dotadb = require('../dotadb'),
    getDotaMatchCounts = require('../getDotaMatchCounts');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'My Dota Stats :D'});
});

// Respondes '/hours-played' with the number of hours played.
router.get('/hours-played', function(req, res, next) {
    dotadb.getLatestDotaMatch(function(match) {
        // Get the hours and format it nicely.
        var hours = matchDetails.getHoursSinceGameWasPlayed(match.match_time, match.match_duration).toFixed(1);

        // Respond to the GET with the hours variable.
        res.send(hours);
    });
});

router.get('/dota-match-counts', function(req, res, next){
    getDotaMatchCounts(12, function(match_count_JSON) {
        res.json(match_count_JSON);
    });
});

module.exports = router;
