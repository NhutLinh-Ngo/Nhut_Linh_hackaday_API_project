const axios = require('axios');
const fetchFunc = require('../utils/fetch_functions');
jest.mock('axios');

describe('Testing API fetch function', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});
	describe('Projects', () => {
		describe('Given a specific page', () => {
			it('should fetch API at page 5 with 24 only projects per page.', async () => {
				axios.get.mockImplementationOnce(() => {
					return Promise.resolve({
						data: {
							page: 5,
							projects: new Array(24).fill(0)
						}
					});
				});

				let page = 5;
				const res = await fetchFunc.fetchProjectAPIByPageAndFilter(page);
				expect(res.page).toEqual(5);
				expect(res.projects.length).toEqual(24);
				expect(axios.get).toHaveBeenCalledTimes(1);
			});

			it('Should return projects that is sorted by newest', async () => {
				axios.get.mockImplementationOnce(() => {
					return Promise.resolve({
						data: {
							page: 5,
							projects: [
								{
									created: 1675429415
								},
								{
									created: 1675397845
								}
							]
						}
					});
				});
				let page = 5;
				const res = await fetchFunc.fetchProjectAPIByPageAndFilter(page);
				let firstProjectDate = new Date(res.projects[0].created * 1000);
				let secondProjectDate = new Date(res.projects[1].created * 1000);
				expect(firstProjectDate > secondProjectDate).toBeTruthy();
				expect(res.page).toEqual(5);
				expect(axios.get).toHaveBeenCalledTimes(1);
			});

			it('Should return no projects when there is specify page is larger than last existing page', async () => {
				axios.get.mockImplementationOnce(() => {
					return Promise.resolve({
						data: {
							last_page: 100,
							page: 5,
							projects: []
						}
					});
				});
				const res = await fetchFunc.fetchProjectAPIByPageAndFilter(5);
				let lastPage = res.last_page;
				let page = res.page;
				expect(lastPage > page).toBeTruthy();
				expect(res.projects.length).toEqual(0);
				expect(axios.get).toHaveBeenCalledTimes(1);
				// expect(axios.get).to
			});
		});
	});
});
