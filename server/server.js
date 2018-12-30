const path = require('path');
const http = require('http');

const express  = require('express');
const socketIO  = require('socket.io');
// var hbs = require('hbs');
const {generateMessage, generateLocationMessage} = require('./utils/messages');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
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

	

	socket.on('join', (params, callback)=>{
		if( !isRealString(params.name) || !isRealString(params.room) ) {
			return callback('Name and Room are required.');
		}

		//user will join this room
		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room);

		io.to(params.room).emit('updateUserList', users.getUserList(params.room));
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to Chat app'));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined the room`));

		callback();


	});

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

		var user = users.getUser(socket.id);
		if( user && isRealString(message.text) ) {
			io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		}
		callback('this is from server');
	});

	socket.on('createLocationMessage', (location) =>{
		var user = users.getUser(socket.id);
		if( user ) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name,location.latitude, location.longitude));
		}
	});


	socket.on('disconnect', ()=>{
		console.log('disconnected from server');
		var user = users.removeUser(socket.id);

		if( user ) {
			//update user list in room
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			//send message in room that user left
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
		}
	});
});

server.listen(port, ()=>{
	console.log(`started on port ${port}`);
});