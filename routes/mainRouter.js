var express = require('express'),
    fs = require('fs'),
    config = require('../config.js'),
    router = express.Router(),
    update = require('../update');

update.init();

router.get('/', function(req, res) {
    res.render('index', { title: 'Keith\'s Dota Stats'});
});

router.get('/dota-match-counts', function(req, res){
    res.json(update.getLatestMatchCounts());
});

module.exports = router;
