var expect  = require('expect');

var {generateMessage} = require('./messages');

describe('generateMessage', () => {
	it('should generate correct message object', ()=>{
		var from = 'Anyname';
		var text = 'This is some message';

		var message = generateMessage(from, text);
		expect(typeof message.createdAt).toBe('number');
		expect(message).toMatchObject({from, text});
	});
});