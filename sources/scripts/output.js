'use strict';

/**
 * Обработчик события нажатия на checkbox
 */

var _onCheckboxClick = function _onCheckboxClick() {
  var checkboxElement = document.querySelector('.checkbox input');
  if (checkboxElement.getAttribute('checked')) {
    checkboxElement.removeAttribute('checked');
  } else {
    checkboxElement.setAttribute('checked', 'checked');
  }
};

/**
 * Плавное проскроливание вверх
 * @param   {Object}  event  Событие
 */
var _scrollToTop = function _scrollToTop() {
  window.scrollBy(0, -70);
  if (window.pageYOffset > 0) {
    requestAnimationFrame(_scrollToTop);
  }
};

/**
 * Изменение отображения подвала страницы при изменении размеров экрана
 */
var _changePageFooterLayout = function _changePageFooterLayout() {
  var pageFooter = document.querySelector('.page-footer'),
      pageFooterNav = document.querySelector('.footer-nav ul');

  if (window.matchMedia('(max-width: 768px)').matches) {
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
var _initShowElements = function _initShowElements() {
  _showElements('.intro', ['.intro-header', '.intro-text', '.intro-image'], 'up');
  _showElements('.pricing-container', ['.first-price', '.last-price'], 'left');
  _showElements('.text-information-header', ['.first-text-information', '.second-text-information'], 'up');
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
var _showElements = function _showElements(elementNeedReached, elementsNeedShow, showAnimationClass) {
  if (window.matchMedia('(min-width: 768px)').matches) {
    // Show elements with animation (tablet and larger devices)
    if (_isElementReached(elementNeedReached)) {
      elementsNeedShow.forEach(function (elem) {
        var element = document.querySelector(elem);
        element.classList.add('in', showAnimationClass);
      });
    }
  } else {
    // Show elements without animation (smartphones)
    elementsNeedShow.forEach(function (elem) {
      var element = document.querySelector(elem);
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
var _isElementReached = function _isElementReached(elem) {
  var element = document.querySelector(elem),
      elementPosition = element.getBoundingClientRect(),
      GAP = 300;

  return elementPosition.top + GAP <= window.innerHeight;
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
var _onSearchState = function _onSearchState() {
  var needHidden = document.querySelectorAll('.info-nav');
  for (var i = 0; i < needHidden.length; i++) {
    needHidden[i].classList.toggle('hidden');
  }
  document.querySelector('.search').classList.toggle('in', 'right');
  document.querySelector('.search-icon').classList.toggle('close');
};

/**
 * Обработчик события появления и скрытия информации о пользователе
 */
var _onUserInfoState = function _onUserInfoState() {
  var userInfoElements = document.querySelectorAll('.user-info');
  for (var i = 0; i < userInfoElements.length; i++) {
    userInfoElements[i].classList.toggle('in');
  }
};

/**
 * Обработчик события скроллинга страницы
 */
var _onWindowScroll = function _onWindowScroll() {
  _initShowElements();
};

/**
 * Обработчик события изменения размера экрана
 */
var _onResize = function _onResize() {
  // Инициализация появления скрытых элементов
  _initShowElements();

  // Перестроение footer
  _changePageFooterLayout();

  // Закрытие информации о пользователе
  var userInfoElements = document.querySelectorAll('.user-info');
  for (var i = 0; i < userInfoElements.length; i++) {
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

/**
 * Наименьшая допустимая громкость
 * @type  {Number}
 */
var MIN_VOLUME = 0;

/**
 * Наибольшая допустимая громкость
 * @type  {Number}
 */
var MAX_VOLUME = 1;

// DOM-элементы для работы с video
var videoContainer = document.querySelector('.embed-responsive'),
    video = document.querySelector('.embed-responsive-item'),
    playVideoButton = document.querySelector('.play-pause-btn img'),
    controlsContainer = document.querySelector('.video-controls-bar'),
    currentTime = document.querySelector('.current-time'),
    totalProgress = document.querySelector('.video-progress .total'),
    currentProgress = document.querySelector('.video-progress .current'),
    volumeButton = document.querySelector('.volume-btn img'),
    volumeRange = document.querySelector('.value-range');

/**
 * Установка длительности видео
 */
var _setVideoDuration = function _setVideoDuration() {
  var duration = document.querySelector('.duration');
  duration.innerHTML = video.duration.toFixed(0);
  _setVideoCurrentTime();
};

/**
 * Установка текущего времени воспроизведения видео
 */
var _setVideoCurrentTime = function _setVideoCurrentTime() {
  currentTime.innerHTML = video.currentTime.toFixed(0);
};

/**
 * Изменение состояния видео
 */
var _onVideoState = function _onVideoState() {
  if (video.paused) {
    _playVideo();
  } else {
    _pauseVideo();
  }
};

/**
 * Воспроизведение видео
 */
var _playVideo = function _playVideo() {
  video.play();
  videoContainer.classList.add('inProcess');
  controlsContainer.classList.remove('hidden');
  playVideoButton.src = 'sources/images/pause.svg';
};

/**
 * Приостановка видео
 */
var _pauseVideo = function _pauseVideo() {
  video.pause();
  videoContainer.classList.add('inProcess');
  playVideoButton.src = 'sources/images/play.svg';
};

/**
 * Показ прогресса воспроизведения видео
 */
var _onProgress = function _onProgress() {
  var progress = Math.floor(video.currentTime) / Math.floor(video.duration);
  _setVideoCurrentTime();
  currentProgress.style.width = Math.floor(progress * totalProgress.offsetWidth) + 'px';
};

/**
 * Прокрутка видео
 * @param   {Object}  event  Событие
 */
function _onRewindVideo(event) {
  var x = (event.pageX - this.offsetLeft) / this.offsetWidth;
  video.currentTime = x * video.duration;
}

/**
 * Управление состоянием звука
 */
function _onVolumeState() {
  if (video.muted) {
    _onVolume();
    volumeRange.value = MAX_VOLUME;
  } else {
    _offVolume();
    volumeRange.value = MIN_VOLUME;
  }
}

/**
 * Включение звука
 */
var _offVolume = function _offVolume() {
  video.muted = true;
  volumeButton.src = 'sources/images/unvolume.svg';
};

/**
 * Выключение звука
 */
var _onVolume = function _onVolume() {
  video.muted = false;
  volumeButton.src = 'sources/images/volume.svg';
};

/**
 * Изменение уровня звука
 */
function _onChangeVolume() {
  video.volume = this.value;
  _onVolume();
}

// Навешивание обработчиковы событий
video.addEventListener('click', _onVideoState);
video.addEventListener('ended', _pauseVideo);
video.addEventListener('canplay', _setVideoDuration);
video.addEventListener('timeupdate', _onProgress);

playVideoButton.addEventListener('click', _onVideoState);
totalProgress.addEventListener('click', _onRewindVideo);
volumeButton.addEventListener('click', _onVolumeState);
volumeRange.addEventListener('click', _onChangeVolume);
//# sourceMappingURL=output.js.map