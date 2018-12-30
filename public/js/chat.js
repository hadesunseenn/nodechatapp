var socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', function() {
	// console.log('connected');
	//when a new user connect ask for username and room
	var params = jQuery.deparam(window.location.search);

	socket.emit('join', params, function(err){
		if( err ) {
			alert(err);
			window.location.href='/';
		} else {
			console.log('No error');
		}
	});
});

socket.on('newMessage', function(message) {
	console.log('new message received', message);
	var formattedTime = moment(message.createdAt).format('h:mm a');

	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
	console.log('new location message received', message);
	var formattedTime = moment(message.createdAt).format('h:mm a');
	
	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		link: message.url,
		from: message.from,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);
	scrollToBottom();
});

/*socket.emit('createMessage', {
	to:'jen@example.com',
	text: 'this is create email'
}, function(data){
	console.log('Got it', data);
});*/

// socket.emit('createEmail', {to:'jen@example.com',text: 'this is create email',createdAt: 234});

socket.on('updateUserList', function(users) {
	var ol = jQuery('<ol></ol>');
	users.forEach(function(user){
		ol.append(jQuery('<li></li>').text(user));
	});

	jQuery('#users').html(ol);
});

socket.on('disconnect', function() {
	console.log('disconnected from server');
});

var messageTextBox = jQuery('input[name="message"]'); 
jQuery('#message-form').on('submit', function(e){
	e.preventDefault();
	socket.emit('createMessage', {
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