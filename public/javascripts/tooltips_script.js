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
function displayOwnerTooltips(e) {
	e.preventDefault();
	console.log('enter div', e.currentTarget);
	let ownerId = this.getAttribute('owner-id');
	const topOffset = window.pageYOffset + this.getBoundingClientRect().top;
	console.log(topOffset);
	const leftOffset = this.getBoundingClientRect().left;
	const offset = { topOffset, leftOffset };
	requestOwnerDataTimer = setTimeout(() => {
		requestOwnerInfo(ownerId, offset);
	}, 1000);
}

function handleMouseLeave(e) {
	console.log('left div');
	clearTimeout(requestOwnerDataTimer);
	let ownerInfoCardDiv = document.getElementById(`owner-info-card`);
	if (ownerInfoCardDiv) ownerInfoCardDiv.remove();
}
