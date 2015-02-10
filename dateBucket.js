var convertSecondsToDays = function(seconds) {
    return seconds / 60 / 60 / 24;
};

module.exports = {
    getDaysAgoFromUnixTime: function(unix_time_seconds) {
        var unix_time_days = convertSecondsToDays(unix_time_seconds);
        var curr_unix_date = convertSecondsToDays(new Date().getTime() / 1000);
        var days_ago = curr_unix_date - unix_time_days;
        var bucket_date = 0;

        if (days_ago > 1) {
            bucket_date = Math.floor(days_ago);
        }

        return bucket_date;
    }
};
