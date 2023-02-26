require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
var SessionStorage = require('./public/session_storage/storage_map');

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
		saveUninitialized: false,
		cookie: { maxAge: 600000 }
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

const fetchProjectAPIByPageAndFilter = async (page, filter) => {
	const filterBy = filter ? filter : 'newest';
	const pageNum = page ? '&page=' + page : '';
	return await fetch(
		`https://api.hackaday.io/v1/projects?api_key=dkcFiON9GcOPZxrt&sortby=${filterBy}&per_page=24${pageNum}`
	).then((res) => res.json());
};
// redirect to /projects
app.get('/', (req, res) => {
	res.redirect('/projects?sortby=newest');
});

//get all projects and store in session, for faster access if it is needed to be reload.
app.get('/projects', async (req, res) => {
	let projectsData = req.session.projects;
	const page = req.query.page ? parseInt(req.query.page) : 1;
	const sortby = parseInt(req.query.sortby);
	// check the session if projects are already loaded then dont fetch again.
	if (!projectsData) {
		projectsData = await fetchProjectAPIByPageAndFilter(page, sortby);

		for (let i = 0; i < projectsData.projects.length; i++) {
			let project = projectsData.projects[i];
			let ownerInfo = await getUserById(project.owner_id);
			projectsData.projects[i].owner = ownerInfo;
		}
		req.session.projects = projectsData;
	}

	res.render('home', { projects: projectsData.projects });
});

function paginatedResults(model) {
	// middleware function
	return (req, res, next) => {
		const page = parseInt(req.query.page);
		const limit = parseInt(req.query.limit);

		// calculating the starting and ending index
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const results = {};
		if (endIndex < model.length) {
			results.next = {
				page: page + 1,
				limit: limit
			};
		}

		if (startIndex > 0) {
			results.previous = {
				page: page - 1,
				limit: limit
			};
		}

		results.results = model.slice(startIndex, endIndex);

		res.paginatedResults = results;
		next();
	};
}

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

	res.status(200).render('project_page', { project });
});

//get the project owner info from API.
app.get('/owner/:id', async (req, res) => {
	let ownerId = req.params.id;
	let ownerInfo = await fetch(
		`https://api.hackaday.io/v1/users/${ownerId}?api_key=dkcFiON9GcOPZxrt`
	);
	let owner = await ownerInfo.json();

	res
		.status(200)
		.render(
			'tooltip_owner_info',
			{ owner, layout: './layouts/tooltip' },
			function (err, html) {
				res.send(html);
			}
		);
});

//configure express server port, on 3000
app.listen(3000, () => {
	console.log('server started on port 3000');
});
