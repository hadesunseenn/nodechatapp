const path = require('path');
const http = require('http');

const express  = require('express');
const socketIO  = require('socket.io');
var hbs = require('hbs');
var {generateMessage} = require('./utils/messages');

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

	//it emits event to a single connection
	// socket.emit('newMessage', {
	// 	from: 'test@user.com',
	// 	text: 'this is text',
	// 	createdAt: 123
	// });

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat app'));


	socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user joined the chat'));

	socket.on('createMessage', (message, callback)=>{
		// console.log('createMessage',message);

		//this emits an event to every connected user
		// io.emit('newMessage', {
		// 	from:message.from,
		// 	text:message.text,
		// 	createdAt:new Date().getTime()
		// });

		//this will send message to everybody except me
		// socket.broadcast.emit('newMessage', generateMessage(message.from, message.text));
		io.emit('newMessage', generateMessage(message.from, message.text));
		callback('this is from server');
	});


	socket.on('disconnect', ()=>{
		console.log('disconnected from server');
	});
});

server.listen(port, ()=>{
	console.log(`started on port ${port}`);
});