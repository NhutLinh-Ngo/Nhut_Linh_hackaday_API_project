require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
var SessionStorage = require('./public/SessionStorage/storageMap');

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
	let projectsData = req.session.projects;

	// check the session if projects are already loaded then dont fetch again.
	if (!projectsData) {
		let projects = await fetch(
			`https://api.hackaday.io/v1/projects?api_key=dkcFiON9GcOPZxrt`
		);
		projectsData = await projects.json();

		for (let i = 0; i < projectsData.projects.length; i++) {
			let project = projectsData.projects[i];
			let ownerInfo = await fetch(
				`https://api.hackaday.io/v1/users/${project.owner_id}?api_key=dkcFiON9GcOPZxrt`
			);
			ownerInfo = await ownerInfo.json();
			projectsData.projects[i].owner = ownerInfo;
		}
		req.session.projects = projectsData;
	}

	res.render('home', { projects: projectsData.projects });
});

//get the project owner info
app.get('/owner/:id', async (req, res) => {
	const ownerId = req.params.id;
	let ownerData = req.session.user;
	if (!ownerData) ownerData = {};

	if (ownerData[ownerId]) return ownerData[ownerId];
	else {
		let ownerInfo = await fetch(
			`https://api.hackaday.io/v1/users/${ownerId}?api_key=dkcFiON9GcOPZxrt`
		);
		ownerData[ownerId] = await ownerInfo.json();
		req.session.user = ownerData;
	}

	console.log(ownerData[ownerId]);
	// res.render('home', { owner: ownerData[ownerId] });
});

//configure express server port, on 3000
app.listen(3000, () => {
	console.log('server started on port 3000');
});
