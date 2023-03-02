const express = require('express');
const controller = require('../controllers/route_controller');

const router = express.Router();

// redirect to /projects
router.get('/', (req, res) => {
	res.redirect('/projects?sortby=newest');
});

//get all projects and store in session, for faster access if it is needed to be reload.
router.get(
	'/projects',
	controller.loadLandingPageProjects,
	controller.loadOwnerIntoEachProject
);

// post next or previous page
router.post('/projects', controller.postNewPaginatedProjectsData);

// get project based on Id
router.get('/project/:id', controller.projectDetailsPage);

//get the project owner info from API.
router.get('/owner/:id', controller.OwnerInfoToolTips);

// Catch unhandled requests and forward to error handler.
router.use((_req, res) => {
	res.status(404).render('error_page');
});
module.exports = router;
