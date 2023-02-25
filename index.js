require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
var SessionStorage = require('./public/SessionStorage/storageMap');

const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

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

//Fetch function to get different details on a single project
const getProjectInfoBy = async (projectId, key) => {
	return await fetch(
		`https://api.hackaday.io/v1/projects/${projectId}${
			key ? '/' + key : ''
		}?api_key=dkcFiON9GcOPZxrt`
	).then((res) => res.json());
};

const getUserById = async (userId) => {
	return await fetch(
		`https://api.hackaday.io/v1/users/${userId}?api_key=dkcFiON9GcOPZxrt`
	).then((res) => res.json());
};

//get all projects and store in session, for faster access if it is needed to be reload.
app.get('/', async (req, res) => {
	let projectsData = req.session.projects;

	// check the session if projects are already loaded then dont fetch again.
	if (!projectsData) {
		let projects = await fetch(
			`https://api.hackaday.io/v1/projects?api_key=dkcFiON9GcOPZxrt&sortby=newest`
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

// get project based on Id
app.get('/project/:id', async (req, res) => {
	const projectId = req.params.id;
	let project = await getProjectInfoBy(projectId);

	// get project details if available
	if (project.details) {
		project.details_info = await getProjectInfoBy(projectId, 'details').then(
			(res) => res.details
		);
	}

	// get project images if available
	if (project.images) {
		project.imagesArray = await getProjectInfoBy(projectId, 'images').then(
			(res) => res.images
		);
	}

	// get project components if available
	if (project.components) {
		project.components_info = await getProjectInfoBy(
			projectId,
			'components'
		).then((res) => res.components);
	}

	// get project logs if available
	if (project.logs) {
		project.logs_info = await getProjectInfoBy(projectId, 'logs').then(
			(res) => res.logs
		);
	}

	// get project instruction if available
	if (project.instruction) {
		project.instruction_info = await getProjectInfoBy(
			projectId,
			'instructions'
		).then((res) => res.instructions);
	}

	project.owner = await getUserById(project.owner_id);

	res.status(200).render('projectPage', { project });
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
