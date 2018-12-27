const path = require('path');
const express  = require('express');
var hbs = require('hbs');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
//we can access all the files in this dir from browser like /help.html
app.use(express.static(publicPath));
app.set('view engine', 'hbs');

// app.get('/home', (req, res)=>{
// 	// res.send('This is about page.');
// 	res.render('about.hbs',{
// 		pageTitle:'About page'
// 	});
// });

// app.use(bodyParser.json());
app.listen(port, ()=>{
	console.log(`started on port ${port}`);
});