require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const fetchFunc = require('./controllers/route_controller');
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

//get all projects and store in session, for faster access if it is needed to be reload.
app.get('/projects', fetchFunc.projectHomePage);
// post next or previous page
app.post('/projects', fetchFunc.loadNewPaginatedData);

// get project based on Id
app.get('/project/:id', fetchFunc.projectDetailsPage);

//get the project owner info from API.
app.get('/owner/:id', fetchFunc.OwnerInfoToolTips);

//configure express server port, on 3000
app.listen(3000, () => {
	console.log('server started on port 3000');
});
