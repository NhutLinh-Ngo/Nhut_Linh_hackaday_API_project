const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

//Fetch function to get different details on a single project
exports.getProjectInfoBy = async (projectId, key) => {
	return await fetch(
		`https://api.hackaday.io/v1/projects/${projectId}${
			key ? '/' + key : ''
		}?api_key=dkcFiON9GcOPZxrt`
	).then((res) => res.json());
};

exports.getUserById = async (userId) => {
	return await fetch(
		`https://api.hackaday.io/v1/users/${userId}?api_key=dkcFiON9GcOPZxrt`
	).then((res) => res.json());
};

exports.fetchProjectAPIByPageAndFilter = async (page, filter) => {
	const filterBy = filter ? filter : 'newest';
	const pageNum = page ? '&page=' + page : '';
	return await fetch(
		`https://api.hackaday.io/v1/projects?api_key=dkcFiON9GcOPZxrt&sortby=${filterBy}&per_page=24${pageNum}`
	).then((res) => res.json());
};
