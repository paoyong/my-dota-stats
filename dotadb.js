/* dotadb.js
 * Manages saving to and grabbing Dota match data from the database */
var mongoose = require('mongoose');

/* This will be the path to our database. I think it's /data/db */
mongoose.connect('mongodb://localhost/dota');

/* Mongoose connecting to the database */
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function(callback) {
    console.log("Successfully opened MongoDB!");
});

var dotaMatchSchema = mongoose.Schema({
    match_id: {
        type: Number,
        unique: true
    },
    /* Note that match_time is the time that 
     * the match -started-, not when it ended! */
    match_time: Number,
    match_duration: Number
});

var DotaMatch = mongoose.model("DotaMatch", dotaMatchSchema);

module.exports = {
    /* Adds a new dota match to the database */
    addDotaMatch: function(matchId, matchTime, matchDuration) {
        var newMatch = new DotaMatch({
            match_id: matchId,
            match_time: matchTime,
            match_duration: matchDuration
        });
        newMatch.save(function(err, match) {
            if (err) return console.error(err);
            console.log("Successfully added Dota match " + matchId + " to the database!");
        });
    },
    /* Grabs the latest played Dota match from the database. */
    getLatestDotaMatch: function(callback) {
        DotaMatch.findOne({}, {}, {
            sort: {
                'match_id': -1
            }
        }, function(err, match) {
            callback(match);
        });
    }
};
