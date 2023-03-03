const supertest = require('supertest');
const app = require('../index');
const controllers = require('../controllers/route_controller');

describe('Good Home Routes (app responds to /)', () => {
	it('should have a status code of 302', async () => {
		const res = await supertest(app).get('/');
		expect(res.statusCode).toBe(302);
		expect(res.redirect).toBeTruthy();
	});
});

const mockReq = () => {
	const req = {};
	// ...from here assign what properties you need on a req to test with
	req.query = {};
	req.page = null;
	req.sortby = '';
	req.projectsData = {
		page: null,
		projects: [
			{
				owner_id: 388349
			},
			{
				owner_id: 1314204
			}
		]
	};
	req.session = {};
	req.params = { id: 189855 };
	req.project = {};
	return req;
};

const mockRes = () => {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.render = jest.fn();
	return res;
};

describe('Testing /Projects', () => {
	describe('response to /projects routes', () => {
		it('should render newest projects at page 1', async () => {
			const next = jest.fn();
			const req = mockReq();
			const res = mockRes();
			await controllers.loadLandingPageProjects(req, res, next);
			expect(req.sortby).toBe('newest');
			expect(req.page).toEqual(1);
			expect(next.mock.calls.length).toBe(1);
		});

		it('Should render home.ejs file', async () => {
			const req = mockReq();
			const res = mockRes();

			await controllers.loadOwnerIntoEachProject(req, res);
			expect(res.render.mock.calls[0][0]).toBe('home');
		});
	});
});

describe('Testing /project/189855', () => {
	describe('response to a project that is existing', () => {
		it('Should return data for the specify project Id', async () => {
			const res = mockRes();
			const req = mockReq();
			const next = jest.fn();

			await controllers.projectDetailsPage(req, res, next);
			expect(req.project.name).toBe('5A-35V Adjustable Switching Power Supply');
			expect(next.mock.calls.length).toBe(1);
		});
		it('Should contain the owner of the project information', async () => {
			const res = mockRes();
			const req = mockReq();
			const next = jest.fn();

			await controllers.projectDetailsPage(req, res, next);
			expect(req.project.owner.username).toBe('hesam.moshiri');
		});

		it('should contain project details', async () => {
			const res = mockRes();
			const req = mockReq();
			const next = jest.fn();

			await controllers.projectDetailsPage(req, res, next);
			expect(req.project.details_info[0].category).toBe('details');
		});
		it('should not contain project instructions', async () => {
			const res = mockRes();
			const req = mockReq();
			const next = jest.fn();

			await controllers.projectDetailsPage(req, res, next);
			expect(req.project.instruction).toEqual(0);
			expect(req.project.instruction_info).toBe(undefined);
		});

		it('Should call the next function', async () => {
			const res = mockRes();
			const req = mockReq();
			const next = jest.fn();

			await controllers.projectDetailsPage(req, res, next);
			expect(next.mock.calls.length).toBe(1);
		});

		it('Should render the project_page.ejs', async () => {
			const res = mockRes();
			const req = mockReq();
			const next = jest.fn();

			await controllers.projectDetailsPage(req, res, next);
			await controllers.loadRecommnedProjects(req, res);
			expect(res.render.mock.calls[0][0]).toBe('project_page');
		});
	});
});
