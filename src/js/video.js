/**
 * Наименьшая допустимая громкость
 * @type  {Number}
 */
let MIN_VOLUME = 0;

/**
 * Наибольшая допустимая громкость
 * @type  {Number}
 */
let MAX_VOLUME = 1;

// DOM-элементы для работы с video
let videoContainer = document.querySelector('.embed-responsive'),
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
let _setVideoDuration = () => {
  let duration = document.querySelector('.duration');
  duration.innerHTML = video.duration.toFixed(0);
  _setVideoCurrentTime();
};

/**
 * Установка текущего времени воспроизведения видео
 */
let _setVideoCurrentTime = () => {
  currentTime.innerHTML = video.currentTime.toFixed(0);
};

/**
 * Изменение состояния видео
 */
let _onVideoState = () => {
  if (video.paused) {
    _playVideo();
  } else {
    _pauseVideo();
  }
};

/**
 * Воспроизведение видео
 */
let _playVideo = () => {
  video.play();
  videoContainer.classList.add('inProcess');
  controlsContainer.classList.remove('hidden');
  playVideoButton.src = 'img/pause.svg';
};

/**
 * Приостановка видео
 */
let _pauseVideo = () => {
  video.pause();
  videoContainer.classList.add('inProcess');
  playVideoButton.src = 'img/play.svg';
};

/**
 * Показ прогресса воспроизведения видео
 */
let _onProgress = () => {
  let progress = Math.floor(video.currentTime) / Math.floor(video.duration);
  _setVideoCurrentTime();
  currentProgress.style.width = Math.floor(progress * totalProgress.offsetWidth) + 'px';
};

/**
 * Прокрутка видео
 * @param   {Object}  event  Событие
 */
function _onRewindVideo(event) {
  let x = (event.pageX - this.offsetLeft) / this.offsetWidth;
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
let _offVolume = () => {
  video.muted = true;
  volumeButton.src = 'img/unvolume.svg';
};

/**
 * Выключение звука
 */
let _onVolume = () => {
  video.muted = false;
  volumeButton.src = 'img/volume.svg';
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
