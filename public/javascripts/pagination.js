import addEventListenerToProjectOwner from './tooltips_script.js';
// ajax to get fetch for new project with reload
function requestProjectDataBasedOnPage(link) {
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function () {
		const main = document.getElementsByTagName('main');
		main[0].innerHTML = this.responseText;
		addEventListenerToPaginationButton();
		addEventListenerToProjectOwner();
		window.history.pushState('', '', link);
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	};
	xmlhttp.open('POST', `${link}`);
	xmlhttp.send();
}

// adding eventlistener to next/prev button
function addEventListenerToPaginationButton() {
	const paginationAnchorTags = document.querySelectorAll(
		'.pagination-wrapper a'
	);
	for (const anchor of paginationAnchorTags) {
		anchor.addEventListener('click', handleNextAndPrevPage);
	}
}

function handleNextAndPrevPage(e) {
	e.preventDefault();
	let link = this.getAttribute('href');
	requestProjectDataBasedOnPage(link);
}

// handling back/forward state change
window.addEventListener('popstate', (e) => {
	e.preventDefault();
	const url = window.location;
	const link = url.pathname + url.search;
	handleStateChange(link);
});

function handleStateChange(link) {
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function () {
		const main = document.getElementsByTagName('main');
		main[0].innerHTML = this.responseText;
		addEventListenerToPaginationButton();
		addEventListenerToProjectOwner();
	};
	xmlhttp.open('POST', `${link}`);
	xmlhttp.send();
}

addEventListenerToPaginationButton();
addEventListenerToProjectOwner();
