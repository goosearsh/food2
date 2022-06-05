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
		constructor(src, alt, title, descr, price, parent, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.parent = document.querySelector('.menu__field .container');
			this.classes = classes;
		}
		render() {
			const element = document.createElement('div');
			if (element.classList.length == 0) {
				element.classList.add('menu__item');
			}
			else {
				this.classes.forEach(item => element.classList.add(item));
			}
			element.innerHTML = `
			<img src=${this.src} alt=${this.alt}>
			<h3 class="menu__item-subtitle">${this.title}</h3>
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

	const getData = async (url) => {
		const res = await fetch(url);
		if (!res.ok) {
			throw new Error('error');
		}
		return await res.json();
	}

	getData('http://localhost:3000/menu')
		.then((obj) => {
			obj.forEach(({ img, altimg, title, descr, price }) => {
				new MenuCard(img, altimg, title, descr, price).render();
			});
		});


	// new MenuCard(
	// 	"img/tabs/vegy.jpg",
	// 	"vegy",
	// 	"Меню 'Фитнес'",
	// 	"Меню 'Фитнес' - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!",
	// 	9
	// ).render();

	const postData = async (url, data) => {
		const res = await fetch(url, {
			method: "POST",
			headers: {
				'Content-type': 'application/form-data',
			},
			body: data,
		});
		return await res.json();
	}


	const forms = document.querySelectorAll('form');
	forms.forEach(form => sendForm(form))


	function sendForm(form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const formData = new FormData(form);
			const obj = {};
			formData.forEach((item, i) => {
				obj[i] = item;
			})
			postData('http://localhost:3000/requests', obj)
				.then((data) => {
					console.log(data);
				})
				.catch(() => {
					console.log('error');
				})
				.finally(() => {
					form.reset();
				});

		});
	}

	//Slider

	const slides = document.querySelectorAll('.offer__slide'),
		prev = document.querySelector('.offer__slider-prev'),
		next = document.querySelector('.offer__slider-next'),
		total = document.querySelector('#total'),
		current = document.querySelector('#current');
	let slideIndex = 1;

	showSlides(slideIndex);

	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
	}
	else {
		total.textContent = slides.length;
	}

	function showSlides(n) {
		if (n > slides.length) {
			slideIndex = 1;
		}

		if (n < 1) {
			slideIndex = slides.length;
		}

		slides.forEach(item => item.style.display = 'none');

		slides[slideIndex - 1].style.display = 'block';

		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		}
		else {
			current.textContent = slideIndex;
		}
	}


	function plusSlides(n) {
		showSlides(slideIndex += n);
	}


	prev.addEventListener('click', () => {
		plusSlides(-1);
	});

	next.addEventListener('click', () => {
		plusSlides(1);
	});




});
