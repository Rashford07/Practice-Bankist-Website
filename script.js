'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const header = document.querySelector('.header');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ---SMOOTH SCROLLING----
btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log(e.target.getBoundingClientRect());

  // console.log(`Current Scroll(X/Y)`, window.pageXOffset, window.pageYOffset);
  // console.log(
  //   `window height / window width`,
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // scrolling
  // 1. Old way

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  // window.scrollTo(0,856);

  // // 2. New way
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////////////////////
// PAGE NAVIGATION

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     // console.log(this);
//     // console.log(el);
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// EVENT DELEGATION

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // MATCHING STRATEGY
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// TABBED COMPONENTS

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard Clause
  if (!clicked) return;

  // Removing Active Classes
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );

  // Active Tab
  clicked.classList.add('operations__tab--active');

  // Activate Content Area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu Fade Animation
const handleHover = function (e) {
  const link = e.target;
  if (link.classList.contains('nav__link')) {
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = nav.querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Navigation

// const s1coords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   console.log(s1coords.top);
//   // console.log(window.pageYOffset);
//   if (window.scrollY > s1coords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: 0,
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;
const headerCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};
const headerObserver = new IntersectionObserver(headerCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Revealing Elements
const sectionCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(sectionCallback, {
  root: null,
  threshold: 0.15,
});

const allsection = document.querySelectorAll('.section');
allsection.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy loading images

const allTargetImages = document.querySelectorAll('img[data-src]');
const imgCallback = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};
const lazyimgObserver = new IntersectionObserver(imgCallback, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
allTargetImages.forEach(img => lazyimgObserver.observe(img));

////////////////////////////////////////////////////////////
// Slider

const slider = function () {
  const allSlides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let curSlide = 0;
  const maxSlide = allSlides.length;
  const dotsContainer = document.querySelector('.dots');

  // Functions

  const goToSlide = function (slide) {
    allSlides.forEach((s, i) => {
      s.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
  };

  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const createDots = function () {
    allSlides.forEach(function (_, i) {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class= "dots__dot" data-slide = "${i}"></button>`
      );
    });
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activateDots(0);
  };
  init();

  // Event Handlers

  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDots(slide);
    }
  });
};

slider();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LECTURES

// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// ---------------CREATING AND INSERTING ELEMENTS---------

// 1. insertadjacenthtml
// header.insertAdjacentHTML(
//   'afterbegin',
//   'We use cookies for improved functionality and analytics. <button class = "btn btn--close--cookie">Go0t it!</button>'
// );

// 2.
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class = "btn btn--close--cookie">Got it!</button>';

// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));

// // 3.
// // header.before(message);
// // header.after(message);

// // ---DELETE ELEMENTS---------
// document
//   .querySelector('.btn--close--cookie')
//   .addEventListener('click', function () {
//     message.remove();
//     // message.parentElement.removeChild(message);
//   });

// //------Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '104%';
// // message.style.boxSizing = 'inherit';

// // console.log(message.style);
// // console.log(getComputedStyle(message).color);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

// This is for the custom properties in the css,the css variables
// document.documentElement.style.setProperty('--color-primary', 'orangeRed');

// -----Attributes---
// const logo = document.querySelector('.nav__logo');
// console.log(logo.src);
// console.log(logo.alt);
// console.log(logo.className);

// For non standard attributes
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('designer', 'Rasheed');
// console.log(logo.getAttribute('designer'));

// For img and href links
// console.log(logo.src); // absolute link
// console.log(logo.getAttribute('src')); // relative link

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// Data attributes
// console.log(logo.dataset.versionNumber);

// Classes
// logo.classList.add('c', 'y');
// logo.classList.remove('c', 'y');
// logo.classList.toggle('c', 'y');
// logo.classList.contains('c', 'y'); // Not includes

// // DO NOT USE
// logo.classList = 'c';

// EVENT LISTENERS

// const h1 = document.querySelector('h1');
// const alertH1 = function (e) {
//   alert('This is a h1 alert message');
// };

// // 1.
// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => {
//   h1.removeEventListener('mouseenter', alertH1);
// }, 3000);

// h1.onmouseenter = function (e) {
//   alert('This is a h1 direct alert message');
// };

// const randomNum = function (min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// };
// const randomColor = () =>
//   `rgb(${randomNum(0, 255)},${randomNum(0, 255)},${randomNum(0, 255)})`;

// // console.log(randomColor());
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);

//   // stop propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('CONTAINER', e.target, e.currentTarget);
//     console.log(this === e.currentTarget);
//   },
//   false
// );

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// });

//-----DOM TRAVERSING-------
// const h1 = document.querySelector('h1');
// // console.log(h1);

// // Going downwards:child

// console.log(h1.querySelectorAll('.highlight')); // give the nodelist of only the child elements with the the selector class regardless of depth of where they are
// console.log(h1.childNodes); // for nodelist of direct child contents
// console.log(h1.children); // for HTML collection of direct child elements
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going upwards:parent

// console.log(h1.parentNode); // direct node parent;
// console.log(h1.parentElement); // direct parent element only;

// h1.closest('.header').style.background = 'var(--color-tertiary)'; // works also the same as queryselector just for CLOSEST PARENT element with the selected class name in this case.(might be DIRECT OR NOT)
// console.log(h1.closest('.header'));
// h1.closest('h1').style.background = 'var(--color-primary)';

// //Going sidewards
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.nextSibling);
// console.log(h1.previousSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(el => {
//   if (el !== h1) {
//     el.style.transform = 'scale(0.5)';
//   }
// });

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('content of the HTML is done loading', e);
// });

// window.addEventListener('load', function (e) {
//   console.log('dsjh', e);
// });

// // window.addEventListener('beforeunload', function (e) {
// //   e.preventDefault();
// //   console.log('dsjh', e);
// //   e.returnValue = '';
// // });
