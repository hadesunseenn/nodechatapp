var socket = io();

socket.on('connect', function() {
	console.log('connected');
});

socket.on('newMessage', function(message) {
	console.log('new message received', message);
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var li = jQuery('<li></li>');
	li.text(`${message.from} ${formattedTime}: ${message.text}`);
	jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
	console.log('new location message received', message);
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">Map Link</a>');

	li.text(`${message.from} ${formattedTime}: `);
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
var messageTextBox = jQuery('input[name="message"]'); 
jQuery('#message-form').on('submit', function(e){
	e.preventDefault();
	socket.emit('createMessage', {
		from:'User',
		text: messageTextBox.val()
	}, function(data){
		messageTextBox.val('');
	});	
});

var sendLocation = jQuery('#send-location');
sendLocation.on('click', function(){
	if(!navigator.geolocation) {
		return alert('Browser does not support geolocation api');
	}

	sendLocation.attr('disabled', 'disabled').text('Sending Location...');
	navigator.geolocation.getCurrentPosition(function(position){
		socket.emit('createLocationMessage', {
			latitude:position.coords.latitude,
			longitude:position.coords.longitude
		});
		sendLocation.removeAttr('disabled').text('Send Location');
	}, function(){
		sendLocation.removeAttr('disabled').text('Send Location');
		alert('Unable to fetch location');
	});
});