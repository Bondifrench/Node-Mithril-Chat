var path = require('path');
var express = require('express');
var logger = require('morgan');

var app = express();

app.set('port', process.env.PORT || 8080);
app.use(express.static(path.join(__dirname, '/client')));
app.use(logger('dev'));

app.get('*', function (req, res) {
	res.sendfile('./index.html')

app.use(function (err, req, res, next) {
	console.log(err.stack);
	res.status(500).send({message: err.message});
});
console.log('Server has started on port: '+ app.get('port'));

var io = require('socket.io').listen(app.listen(app.get('port')));

io.sockets.on('connection', function (socket) {
	console.log('A user connected');
	socket.emit('message', {message: 'Welcome to the chat room!'});
	socket.on('send', function (data) {
		console.log(data);
		io.sockets.emit('message', data)
	});
	socket.on('disconnect', function () {
		console.log('user disconnected');
	})
});
