var express = require('express'),
    router = express.Router(),
    /* Custom modules */
    matchDetails = require('../getMatchJSONFromId'),
    dotadb = require('../dotadb');

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

module.exports = router;
