var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dota');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', function (callback) {
	console.log("Successfully opened MongoDB");
});

var dotaMatchSchema = mongoose.Schema({
    match_id: {type: Number, unique: true},
    match_time: Number
});

var DotaMatch = mongoose.model("DotaMatch", dotaMatchSchema);

module.exports = {
    addDotaMatch: function(matchId, matchTime) {
    	var newMatch = new DotaMatch({ 
    		match_id: matchId,
    		match_time: matchTime
    	});
    	newMatch.save(function (err, match) {
    		if (err) return console.error(err);
	    	console.log("Successfully added Dota match " + matchId + " to the database!");
    	});
    },
    getLatestDotaMatch: function(callback) {
    	DotaMatch.findOne({}, {}, {sort: {'match_id': -1}}, function(err, match) {
    		callback(match);
    	});
    }
}
