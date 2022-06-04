window.addEventListener('DOMContentLoaded', () => {
	//табы
	const tabContent = document.querySelectorAll('.tabcontent'),
		tabs = document.querySelectorAll('.tabheader__item'),
		tabsParent = document.querySelector('.tabheader__items');
	function hideTabs() {
		tabContent.forEach((item) => {
			item.style.display = 'none';
			tabs.forEach(item => item.classList.remove('tabheader__item_active'));
		});
	}
	hideTabs();
	function viewTab(i) {
		tabContent[i].style.display = 'block';
		tabs[i].classList.add('tabheader__item_active');
	}
	viewTab(0);
	function viewCorrectTab() {
		tabsParent.addEventListener('click', (e) => {
			console.log(e.target);
			if (e.target && e.target.classList.contains('tabheader__item')) {
				tabs.forEach((item, i) => {
					if (e.target == item) {
						hideTabs();
						viewTab(i);
					}
				});
			}
		});
	}
	viewCorrectTab();



	//Модальное окно
	const modalTrigger = document.querySelectorAll('[data-modal]'),
		modal = document.querySelector('.modal'),
		modalCloseBtn = document.querySelector('[data-close]');


	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		clearInterval(modalTimerId);
	}

	modalTrigger.forEach(btn => {
		btn.addEventListener('click', openModal);
	});

	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = '';
	}

	modalCloseBtn.addEventListener('click', closeModal);

	modal.addEventListener('click', (e) => {
		if (e.target === modal || e.target.getAttribute('data-close') == '') {
			modal.classList.add('hide');
			modal.classList.remove('show');
			document.body.style.overflow = '';
		}
	});

	document.addEventListener('keydown', (e) => {
		if (e.code === 'Escape') {
			closeModal();
		}
	});

	const modalTimerId = setTimeout(openModal, 50000);

	//Таймер

	const deadline = '2022-06-20';

	function getTime(endtime) {
		const t = Date.parse(endtime) - Date.parse(new Date()),
			days = Math.floor(t / (1000 * 60 * 60 * 24)),
			hours = Math.floor((t / (1000 * 60 * 60) % 24)),
			minutes = Math.floor((t / 1000 * 60) % 60),
			seconds = Math.floor((t / 1000) % 60);
		return {
			total: t,
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
		};
	}
	getTime();

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		}
		else {
			return num;
		}
	}



	function getTimer(selector, endtime) {
		const timer = document.querySelector(selector),
			days = timer.querySelector('#days'),
			hours = timer.querySelector('#hours'),
			minutes = timer.querySelector('#minutes'),
			seconds = timer.querySelector('#seconds'),
			interval = setInterval(setTime, 1000);

		function setTime() {
			const time = getTime(endtime);
			days.innerHTML = getZero(time.days);
			hours.innerHTML = getZero(time.hours);
			minutes.innerHTML = getZero(time.minutes);
			seconds.innerHTML = getZero(time.seconds);
			if (time.total <= 0) {
				clearInterval(interval);
			}
		}
		setTime();
	}

	getTimer('.timer', deadline);



	//Карточки


	class MenuCard {
		constructor(src, alt, subtitle, descr, price, parent, ...classes) {
			this.src = src;
			this.alt = alt;
			this.subtitle = subtitle;
			this.descr = descr;
			this.descr = descr;
			this.price = price;
			this.parent = document.querySelector('.menu__field .container');
			this.classes = classes;
		}
		render() {
			const element = document.createElement('div');
			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			}
			else {
				this.classes.forEach(className => element.classList.add(className));
			}
			element.innerHTML = `
			<img src=${this.src} alt=${this.alt}>
			<h3 class="menu__item-subtitle">${this.subtitle}</h3>
			<div class="menu__item-descr">${this.descr}</div>
			<div class="menu__item-divider"></div>
			<div class="menu__item-price">
				<div class="menu__item-cost">Цена:</div>
				<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
			</div>
			`;
			this.parent.append(element);
		}
	}

	const getResources = async (url) => {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error(`error`);
		}
		return await res.json();
	}


	// getResources('http://localhost:3000/menu')
	// 	.then((data) => {
	// 		data.forEach(({ img, altimg, title, descr, price }) => {
	// 			new MenuCard(img, altimg, title, descr, price).render();
	// 		})
	// 	});


	axios.get('http://localhost:3000/menu')
		.then(data =>
			data.data.forEach(({ img, altimg, title, descr, price }) => {
				new MenuCard(img, altimg, title, descr, price).render();
			}));

	//Форма

	const forms = document.querySelectorAll('form');
	forms.forEach(item => {
		sendForm(item);
	});
	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json'
			},
			body: data,
		})
		return await res.json();
	}


	function sendForm(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const formData = new FormData(form);
			const json = JSON.stringify(Object.fromEntries(formData.entries()));
			postData('http://localhost:3000/requests', json)
				.then((data) => {
					console.log(data);
				})
				.catch(() => {
					console.log('error');
				})
				.finally(() => {
					form.reset();
				})
		})
	}


	//Слайдер

	// const slider = document.querySelector('.offer__slider'),
	// 	sliderWrapper = slider.querySelector('.offer__slider-wrapper'),
	// 	currentSlide = slider.querySelector('#current'),
	// 	sliderCounter = slider.querySelector('.offer__slider-counter');


	// sliderCounter.addEventListener('click', (e) => {
	// 	let counter = +currentSlide.innerHTML;
	// 	if (e.target.classList.contains('offer__slider-next')) {
	// 		counter++;
	// 		currentSlide.innerHTML = `0${counter}`;
	// 		if (counter == 1) {
	// 			slider.innerHTML === '';
	// 			sliderWrapper.innerHTML = `
	// 				<div class="offer__slide">
	// 							<img src="img/slider/pepper.jpg" alt="pepper">
	// 						</div>
	// 				`;
	// 			console.log(counter);
	// 		}
	// 		else if (counter == 2) {
	// 			slider.innerHTML === '';
	// 			sliderWrapper.innerHTML = `
	// 			<div class="offer__slide">
	// 			<img src="img/slider/food-12.jpg" alt="food">
	// 		</div>
	// 				`;
	// 			console.log(counter);
	// 		}
	// 		else if (counter == 3) {
	// 			slider.innerHTML === '';
	// 			sliderWrapper.innerHTML = `
	// 			<div class="offer__slide">
	// 				<img src="img/slider/olive-oil.jpg" alt="oil">
	// 			</div>
	// 				`;
	// 			console.log(counter);
	// 		}
	// 		else if (counter == 4) {
	// 			slider.innerHTML === '';
	// 			sliderWrapper.innerHTML = `
	// 			<div class="offer__slide">
	// 							<img src="img/slider/paprika.jpg" alt="paprika">
	// 						</div>
	// 				`;
	// 			console.log(counter);
	// 		}
	// 		else if (counter > 4) {
	// 			counter = 1;
	// 			slider.innerHTML === '';
	// 			sliderWrapper.innerHTML = `
	// 				<div class="offer__slide">
	// 							<img src="img/slider/pepper.jpg" alt="pepper">
	// 						</div>
	// 				`;
	// 			console.log(counter);
	// 		}
	// 		currentSlide.innerHTML = `0${counter}`;
	// 	}
	// 	if (e.target.classList.contains('offer__slider-prev')) {
	// 		let counter = +currentSlide.innerHTML;
	// 		counter--;
	// 		if (counter == 1) {
	// 			slider.innerHTML === '';
	// 			sliderWrapper.innerHTML = `
	// 				<div class="offer__slide">
	// 							<img src="img/slider/pepper.jpg" alt="pepper">
	// 						</div>
	// 				`;
	// 			console.log(counter);
	// 		}
	// 		else if (counter == 2) {
	// 			slider.innerHTML === '';
	// 			sliderWrapper.innerHTML = `
	// 			<div class="offer__slide">
	// 			<img src="img/slider/food-12.jpg" alt="food">
	// 		</div>
	// 				`;
	// 			console.log(counter);
	// 		}
	// 		else if (counter == 3) {
	// 			slider.innerHTML === '';
	// 			sliderWrapper.innerHTML = `
	// 			<div class="offer__slide">
	// 				<img src="img/slider/olive-oil.jpg" alt="oil">
	// 			</div>
	// 				`;
	// 			console.log(counter);
	// 		}
	// 		else if (counter == 4) {
	// 			slider.innerHTML === '';
	// 			sliderWrapper.innerHTML = `
	// 			<div class="offer__slide">
	// 							<img src="img/slider/paprika.jpg" alt="paprika">
	// 						</div>
	// 				`;
	// 			console.log(counter);
	// 		}
	// 		else if (counter < 1) {
	// 			slider.innerHTML === '';
	// 			counter = 4;
	// 			sliderWrapper.innerHTML = `
	// 			<div class="offer__slide">
	// 							<img src="img/slider/paprika.jpg" alt="paprika">
	// 						</div>
	// 				`;
	// 			console.log(counter);
	// 		}
	// 		currentSlide.innerHTML = `0${counter}`;
	// 	}
	// });


	












});
