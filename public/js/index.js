var socket = io();

socket.on('connect', function() {
	console.log('connected');
});

socket.on('newMessage', function(message) {
	console.log('new message received', message);
	var li = jQuery('<li></li>');
	li.text(`${message.from} : ${message.text}`);
	jQuery('#messages').append(li);
});

/*socket.emit('createMessage', {
	to:'jen@example.com',
	text: 'this is create email'
}, function(data){
	console.log('Got it', data);
});*/

// socket.emit('createEmail', {to:'jen@example.com',text: 'this is create email',createdAt: 234});

socket.on('disconnect', function() {
	console.log('disconnected from server');
});

jQuery('#message-form').on('submit', function(e){
	e.preventDefault();
	socket.emit('createMessage', {
		from:'User',
		text: jQuery('input[name="message"]').val()
	}, function(data){
		console.log('Got it', data);
	});	
});