const path = require('path');
const http = require('http');

const express  = require('express');
const socketIO  = require('socket.io');
var hbs = require('hbs');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
//we can access all the files in this dir from browser like /help.html
app.use(express.static(publicPath));
app.set('view engine', 'hbs');

io.on('connection', (socket)=>{
	console.log('New user connected');

	socket.on('disconnect', ()=>{
		console.log('disconnected from server');
	});
});

server.listen(port, ()=>{
	console.log(`started on port ${port}`);
});