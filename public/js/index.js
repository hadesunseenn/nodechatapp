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

socket.on('newLocationMessage', function(message) {
	console.log('new location message received', message);
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">Map Link</a>');

	li.text(`${message.from} : `);
	a.attr('href', `${message.url}`);
	li.append(a);
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

var sendLocation = jQuery('#send-location');
sendLocation.on('click', function(){
	if(!navigator.geolocation) {
		return alert('Browser does not support geolocation api');
	}
	navigator.geolocation.getCurrentPosition(function(position){
		console.log(position);
		socket.emit('createLocationMessage', {
			latitude:position.coords.latitude,
			longitude:position.coords.longitude
		});
	}, function(){
		alert('Unable to fetch location');
	});
});