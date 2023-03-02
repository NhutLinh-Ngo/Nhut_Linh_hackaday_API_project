require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const fetchFunc = require('./controllers/route_controller');
const router = require('./routes/main');
//serving static css file
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

// configure ejs
app.set('view engine', 'ejs');
app.set('layout', './layouts/main');

// use session to store data.
app.use(
	session({
		secret: 'secret-key',
		resave: false,
		saveUninitialized: false
	})
);

// redirect to /projects
app.get('/', (req, res) => {
	res.redirect('/projects?sortby=newest');
});

app.use('/', router);

//configure express server port, on 3000
app.listen(3000, () => {
	console.log('server started on port 3000');
});

module.exports = app;
