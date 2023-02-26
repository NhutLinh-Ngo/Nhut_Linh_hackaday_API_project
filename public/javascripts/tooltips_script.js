// ajax to to get route with ownerId to fetch for owner information
function requestOwnerInfo(ownerId, offset) {
	const xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function () {
		let div = document.createElement('div');
		div.innerHTML = this.responseText;
		div.style.top = `${offset.topOffset}px`;
		div.style.left = `${offset.leftOffset}px`;
		div.setAttribute('id', 'owner-info-card');
		document.body.appendChild(div);
	};
	xmlhttp.open('GET', `/owner/${ownerId}`);
	xmlhttp.send();
}

const ProjectOwnersDiv = document.querySelectorAll('.project-owner');

for (const owner of ProjectOwnersDiv) {
	owner.addEventListener('mouseleave', handleMouseLeave);
	owner.addEventListener('mouseenter', displayOwnerTooltips);
}

var requestOwnerDataTimer;

// function to handle display owner tooltips
function displayOwnerTooltips(e) {
	e.preventDefault();
	let ownerId = this.getAttribute('owner-id');
	const topOffset = window.pageYOffset + this.getBoundingClientRect().top;
	const leftOffset = this.getBoundingClientRect().left;
	const offset = { topOffset, leftOffset };
	requestOwnerDataTimer = setTimeout(() => {
		requestOwnerInfo(ownerId, offset);
	}, 800);
}

function handleMouseLeave(e) {
	clearTimeout(requestOwnerDataTimer);
	let ownerInfoCardDiv = document.getElementById(`owner-info-card`);
	if (ownerInfoCardDiv) ownerInfoCardDiv.remove();
}
