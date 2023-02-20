let express = require('express');
let app = express();
const fetch = (...args) =>
	import('node-fetch').then(({ default: fetch }) => fetch(...args));

// configure ejs
app.set('view engine', 'ejs');

//test route
app.get('/', async (req, res) => {
	const projects = await fetch(
		`https://api.hackaday.io/v1/projects?api_key=${process.env.API_KEY}`
	);
	const data = await projects.json();

	res.render('home', { projects: data });
});

//configure express server port, on 3000
app.listen(3000, () => {
	console.log('server started on port 3000');
});
