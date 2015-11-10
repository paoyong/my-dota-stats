var grabJSON = require('./grabJSON');
var matchCounts = {};
var config = require('./config');

function getLatestMatchCounts() {
    return matchCounts;
}

function update() {
    grabJSON(function(json) {
        matchCounts = json;
    });
}

module.exports = {
    init: function() {
        update();
        setInterval(update, config.refresh_minutes * 60 * 1000);
    },
    getLatestMatchCounts: getLatestMatchCounts
}
