// scroll function, setting anchor tag active
const links = document.querySelectorAll('.navigation a');

for (const link of links) {
	link.addEventListener('click', handleClickScroll);
}

function handleClickScroll(e) {
	e.preventDefault();
	const href = this.getAttribute('href');
	const offsetTop = document.querySelector(href).offsetTop;
	this.classList.add('active');
	links.forEach((link) => {
		if (link.getAttribute('href') !== href) link.classList.remove('active');
	});
	scroll({
		top: offsetTop,
		behavior: 'smooth'
	});
}

// display image when hover
const imagesLink = document.querySelectorAll('.projet-images a');
for (const imageLink of imagesLink) {
	imageLink.addEventListener('mouseover', changeGallaryImage);
	imageLink.addEventListener('click', changeGallaryImage);
}

function changeGallaryImage(e) {
	e.preventDefault();
	const imageId = this.getAttribute('href').split('#')[1];
	const imageUrl = document.getElementById(imageId).getAttribute('src');
	document.getElementById('project-main-image-display').src = imageUrl;
}

//take data-src from details image and put it into src to display image
let imgEl = document.getElementsByTagName('img');
for (var i = 0; i < imgEl.length; i++) {
	if (imgEl[i].getAttribute('data-src')) {
		imgEl[i].setAttribute('src', imgEl[i].getAttribute('data-src'));
	}
}
