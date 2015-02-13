var convertSecondsToDays = function(seconds) {
    return seconds / 60 / 60 / 24;
};

// http://stackoverflow.com/a/10944417
function getSecondsSinceMidnight() {
    var now = new Date(),
        then = new Date(now.getFullYear(),
                        now.getMonth(),
                        now.getDate(),
                        0, 0, 0),
        diff= now.getTime() - then.getTime();

    return diff / 1000;
}

module.exports = function(input_seconds_since_epoch) {
        var seconds_since_epoch = (new Date().getTime()) / 1000,
            seconds_since_midnight = getSecondsSinceMidnight(),
            seconds_before_midnight = seconds_since_epoch - seconds_since_midnight - input_seconds_since_epoch,
            bucket_date = 0;

        if (0 < seconds_before_midnight) {
            bucket_date = Math.ceil(convertSecondsToDays(seconds_before_midnight));
        }

        return bucket_date;
};
