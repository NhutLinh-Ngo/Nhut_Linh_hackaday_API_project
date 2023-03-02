const axios = require('axios');

//Fetch function to get different details on a single project
exports.getProjectInfoById = async (projectId, key) => {
	return await axios
		.get(
			`https://api.hackaday.io/v1/projects/${projectId}${
				key ? '/' + key : ''
			}?api_key=dkcFiON9GcOPZxrt`
		)
		.then((response) => response.data)
		.catch((error) => {
			console.log(error);
		});
};

exports.getUserById = async (userId) => {
	return await axios
		.get(`https://api.hackaday.io/v1/users/${userId}?api_key=dkcFiON9GcOPZxrt`)
		.then((response) => response.data);
};

exports.fetchProjectAPIByPageAndFilter = async (page, filter = 'newest') => {
	const pageNum = page ? '&page=' + page : '';
	return await axios
		.get(
			`https://api.hackaday.io/v1/projects?api_key=dkcFiON9GcOPZxrt&sortby=${filter}&per_page=24${pageNum}`
		)
		.then((response) => response.data);
};

exports.findRelatedProjectedByTag = async (tag) => {
	return await axios
		.get(
			`https://api.hackaday.io/v1/projects/search?search_term=${tag}&api_key=dkcFiON9GcOPZxrt&per_page=4`
		)
		.then((response) => response.data);
};
