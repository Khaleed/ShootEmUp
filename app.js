// set up a server for the game
var express = require('express');
var app = express();
var server = require('http').Server(app);
var port = process.env.port || 3000;
// routes
app.get('/', function(req, res) {
	res.sendFile(__dirname + 'index.html');
});
// middleware
app.use('static', express.static('static'));

