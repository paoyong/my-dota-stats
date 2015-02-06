var fs = require('fs'),
    jsdom = require('jsdom'),
    express = require('express'),
    path = require('path'),

    /* Custom modules */
    matchDetails = require('./getMatchJSONFromId'),
    dotadb = require('./dotadb'), 

    /* Digital Ocean server port and IP */
    port = 8888,
    ip = '104.131.118.167',
    main_router = require("./routes/index");

/* Comment this line when deploying to Git and the server */
//var ip = 'localhost';

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use('/', main_router);

// Start the server.
app.listen(port);
