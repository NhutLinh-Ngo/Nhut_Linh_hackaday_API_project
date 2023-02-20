require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

// configure ejs
app.set('view engine', 'ejs');

//serving static css file
app.use(express.static(path.join(__dirname, 'public')));

// use session to store data.
app.use(
	session({
		secret: 'secret-key',
		resave: false,
		saveUninitialized: false
	})
);
//get all projects and store in session, for faster access if it is needed to be reload.
app.get('/', async (req, res) => {
	if (!req.session.projects)
		req.session.projects = await fetch(
			`https://api.hackaday.io/v1/projects?api_key=dkcFiON9GcOPZxrt`
		);

	if (!req.session.data) req.session.data = await req.session.projects.json();
	res.render('home', { projects: req.session.data });
});

//configure express server port, on 3000
app.listen(3000, () => {
	console.log('server started on port 3000');
});
