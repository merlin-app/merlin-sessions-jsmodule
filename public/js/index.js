import analytics from './analytics';
analytics.init();

document.querySelector('.js-button').addEventListener('click', function(e) {
  analytics.onClick();
});

document.querySelector('.js-link').addEventListener('mouseover', function(e) {
  analytics.onHover();
});