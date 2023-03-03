const supertest = require('supertest');
const app = require('../index');
const fetchFunc = require('../utils/fetch_functions');

describe('Good Home Routes (app responds to /)', () => {
	it('should have a status code of 302', async () => {
		const res = await supertest(app).get('/');
		expect(res.statusCode).toBe(302);
	});
});

describe('Testing API fetch function', () => {
	describe('Projects', () => {
		describe('Given a specific page', () => {
			it('should fetch API at page 5 with 24 only projects per page.', async () => {
				let page = 5;
				const res = await fetchFunc.fetchProjectAPIByPageAndFilter(page);
				expect(res.page).toEqual(5);
				expect(res.projects.length).toEqual(24);
			});

			it('Should return projects that is sorted by newest', async () => {
				let page = 5;
				const res = await fetchFunc.fetchProjectAPIByPageAndFilter(page);
				let firstProjectDate = new Date(res.projects[0].created * 1000);
				let secondProjectDate = new Date(res.projects[1].created * 1000);
				expect(firstProjectDate > secondProjectDate).toBeTruthy();
			});
		});
	});
});
