const fetchFunc = require('../utils/fetch_functions');

exports.loadLandingPageProjects = async (req, res, next) => {
	const page = req.query.page ? parseInt(req.query.page) : 1;
	const sortby = req.query.sortby;

	// fetch API based on pages and sortby key work
	let data = await fetchFunc.fetchProjectAPIByPageAndFilter(page, sortby);
	if (data.error) {
		res.status(404).render('error_page');
	} else {
		req.projectsData = data;
		req.page = page;
		req.sortby = sortby;
		next();
	}
};
exports.loadOwnerIntoEachProject = async (req, res) => {
	let data = req.projectsData;
	let page = req.page;
	let sortby = req.sortby;
	// this get route will alwaysrefresh page,
	// thus we want to refresh the session storage to store new data
	let projectsData = {};

	// for each entry get owner info to display project owner.
	for (let i = 0; i < data.projects.length; i++) {
		let project = data.projects[i];
		let ownerInfo = await fetchFunc.getUserById(project.owner_id);
		data.projects[i].owner = ownerInfo;
	}

	// setting the project session to new map
	projectsData[page] = data;
	req.session.projects = projectsData;
	res.status(200).render('home', { projects: data.projects, page, sortby });
};

exports.postNewPaginatedProjectsData = async (req, res) => {
	const page = req.query.page ? parseInt(req.query.page) : 1;
	const sortby = req.query.sortby;
	let projectsData = req.session.projects;
	if (!projectsData[page]) {
		let data = await fetchFunc.fetchProjectAPIByPageAndFilter(page, sortby);
		if (data.error) {
			res.status(404).render('error_page');
		} else {
			for (let i = 0; i < data.projects.length; i++) {
				let project = data.projects[i];
				let ownerInfo = await fetchFunc.getUserById(project.owner_id);
				data.projects[i].owner = ownerInfo;
			}
			projectsData[page] = data;
			req.session.projects = projectsData;
		}
	}
	res.status(200).render(
		'home',
		{
			projects: projectsData[page].projects,
			page,
			sortby,
			layout: './layouts/blank_layout'
		},
		function (err, html) {
			res.send(html);
		}
	);
};

exports.projectDetailsPage = async (req, res) => {
	const projectId = req.params.id;
	let project = await fetchFunc.getProjectInfoById(projectId);

	if (project.project == 0) {
		res.status(404).render('error_page');
	} else {
		// get project details if available
		if (project.details) {
			project.details_info = await fetchFunc
				.getProjectInfoById(projectId, 'details')
				.then((res) => res.details);
		}

		// get project images if available
		if (project.images) {
			project.imagesArray = await fetchFunc
				.getProjectInfoById(projectId, 'images')
				.then((res) => res.images);
		}

		// get project components if available
		if (project.components) {
			project.components_info = await fetchFunc
				.getProjectInfoById(projectId, 'components')
				.then((res) => res.components);
		}

		// get project logs if available
		if (project.logs) {
			project.logs_info = await fetchFunc
				.getProjectInfoById(projectId, 'logs')
				.then((res) => res.logs);
		}

		// get project instruction if available
		if (project.instruction) {
			project.instruction_info = await fetchFunc
				.getProjectInfoById(projectId, 'instructions')
				.then((res) => res.instructions);
		}

		project.owner = await fetchFunc.getUserById(project.owner_id);

		res.status(200).render('project_page', { project });
	}
};

exports.OwnerInfoToolTips = async (req, res) => {
	let ownerId = req.params.id;
	let owner = await await fetchFunc.getUserById(ownerId);
	res
		.status(200)
		.render(
			'tooltip_owner_info',
			{ owner, layout: './layouts/blank_layout' },
			function (err, html) {
				res.send(html);
			}
		);
};
