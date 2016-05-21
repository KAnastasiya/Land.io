'use strict';

/**
 * Обработчик события нажатия на checkbox
 */
let _onCheckboxClick = () => {
  let checkboxElement = document.querySelector('.checkbox input');
  if(checkboxElement.getAttribute('checked')) {
    checkboxElement.removeAttribute('checked');
  } else {
    checkboxElement.setAttribute('checked', 'checked');
  }
};

/**
 * Плавное проскроливание вверх
 * @param   {Object}  event  Событие
 */
let _scrollToTop = () => {
  window.scrollBy(0, -70);
  if (window.pageYOffset > 0) {
    requestAnimationFrame(_scrollToTop);
  }
};

/**
 * Изменение отображения подвала страницы при изменении размеров экрана
 */
let _changePageFooterLayout = () => {
  let pageFooter = document.querySelector('.page-footer'),
    pageFooterNav = document.querySelector('.footer-nav ul');

  if(window.matchMedia('(max-width: 768px)').matches) {
    pageFooter.classList.add('text-center');
    pageFooterNav.classList.add('nav-justified');
  } else {
    pageFooter.classList.remove('text-center');
    pageFooterNav.classList.remove('nav-justified');
  }
};

/**
 * Инициализация анимации
 */
let _initShowElements = () => {
  _showElements(
    '.intro',
    ['.intro-header', '.intro-text', '.intro-image'],
    'up'
  );
  _showElements(
    '.pricing-container',
    ['.first-price', '.last-price'],
    'left'
  );
  _showElements(
    '.text-information-header',
    ['.first-text-information', '.second-text-information'],
    'up'
  );
};

/**
 * Показ скрытых компонентов с применением необходимой анимации
 * @param  {String}  elementNeedReached  Селектор DOM-элемента, при достижении
 *                                       которого будут отрисованы новые DOM-элементы
 * @param  {Array}   elementsNeedShow    Список селекторов DOM-элементов, которые
 *                                       будут отрисованы
 * @param  {String}  showAnimationClass  Название класса, описывающего анимацию
 *                                       отрисовки элемента
 */
let _showElements = (elementNeedReached, elementsNeedShow, showAnimationClass) => {
  if(window.matchMedia('(min-width: 768px)').matches) {
    // Show elements with animation (tablet and larger devices)
    if ( _isElementReached(elementNeedReached) ) {
      elementsNeedShow.forEach(function(elem) {
        let element = document.querySelector(elem);
        element.classList.add('in', showAnimationClass);
      });
    }
  } else {
    // Show elements without animation (smartphones)
    elementsNeedShow.forEach(function(elem) {
      let element = document.querySelector(elem);
      element.style.transform = 'translateX(0)';
      element.style.transform = 'translateY(0)';
      element.classList.add('in');
    });
  }
};

/**
 * Проверка на достижение DOM-элемента при скроллинге
 * @param   {String}   Селектор DOM-элемента
 * @return  {Boolean}
 */
let _isElementReached = (elem) => {
  let element = document.querySelector(elem),
    elementPosition = element.getBoundingClientRect(),
    GAP = 300;

  return (elementPosition.top + GAP) <= window.innerHeight;
};

/**
 * Обработчик события проскроливания страницы в самый вверх
 * @param   {Object}  event  Событие
 */
function _onToTop(event) {
  event.preventDefault();
  _scrollToTop();
}

/**
 * Обработчик события появления и скрытия поля поиска
 */
let _onSearchState = () => {
  let needHidden = document.querySelectorAll('.info-nav');
  for(let i = 0; i < needHidden.length; i++) {
    needHidden[i].classList.toggle('hidden');
  }
  document.querySelector('.search').classList.toggle('in', 'right');
  document.querySelector('.search-icon').classList.toggle('close');
};

/**
 * Обработчик события появления и скрытия информации о пользователе
 */
let _onUserInfoState = () => {
  let userInfoElements = document.querySelectorAll('.user-info');
  for(let i = 0; i < userInfoElements.length; i++) {
    userInfoElements[i].classList.toggle('in');
  }
};

/**
 * Обработчик события скроллинга страницы
 */
let _onWindowScroll = () => {
  _initShowElements();
};

/**
 * Обработчик события изменения размера экрана
 */
let _onResize = () => {
  // Инициализация появления скрытых элементов
  _initShowElements();

  // Перестроение footer
  _changePageFooterLayout();

  // Закрытие информации о пользователе
  let userInfoElements = document.querySelectorAll('.user-info');
  for(let i = 0; i < userInfoElements.length; i++) {
    userInfoElements[i].classList.remove('in', 'increase');
  }
};

//Навешивание обработчик событий
window.addEventListener('resize', _onResize);
window.addEventListener('scroll', _onWindowScroll);
document.querySelector('.checkbox').addEventListener('click', _onCheckboxClick);
document.querySelector('.to-top').addEventListener('click', _onToTop);

$('.search-container').on('show.bs.dropdown hide.bs.dropdown', _onSearchState);
$('.user-info-container, .user-info-container-xs').on('show.bs.dropdown hide.bs.dropdown', _onUserInfoState);

// Инициализация интерфейса по умолчанию (сразу после загрузки страницы)
_initShowElements();
_changePageFooterLayout();
