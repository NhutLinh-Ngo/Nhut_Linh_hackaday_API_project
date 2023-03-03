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
	let user = await axios.get(
		`https://api.hackaday.io/v1/users/${userId}?api_key=dkcFiON9GcOPZxrt`
	);

	return user.data;
};

exports.fetchProjectAPIByPageAndFilter = async (page, filter = 'newest') => {
	const pageNum = page ? '&page=' + page : '';
	let projects = await axios.get(
		`https://api.hackaday.io/v1/projects?api_key=dkcFiON9GcOPZxrt&sortby=${filter}&per_page=24${pageNum}`
	);
	return projects.data;
};

exports.findRelatedProjectedByTag = async (tag) => {
	let projects = await axios.get(
		`https://api.hackaday.io/v1/projects/search?search_term=${tag}&api_key=dkcFiON9GcOPZxrt&per_page=4`
	);

	return projects.data;
};
