var socket = io();

socket.on('connect', function() {
	console.log('connected');
});

socket.on('newMessage', function(message) {
	console.log('new message received', message);
});

// socket.emit('createMessage', {
// 	to:'jen@example.com',
// 	text: 'this is create email'
// });

// socket.emit('createEmail', {to:'jen@example.com',text: 'this is create email',createdAt: 234});

socket.on('disconnect', function() {
	console.log('disconnected from server');
});