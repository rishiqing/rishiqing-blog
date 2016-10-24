/*
* @Author: Jiang Guoxi
* @Date:   2016-10-24 09:31:38
* @Last Modified by:   Jiang Guoxi
* @Last Modified time: 2016-10-24 09:32:26
*/

!function () {
  var ua = navigator.userAgent, $body = $('body');
  window.isMobile = true;
  window.isMM = false;
  if (/MicroMessenger/i.test(ua)) {
    window.isMM = true;
    $body.addClass('MM');
  }
  if (/iPhone/i.test(ua)) {
    return $body.addClass('mobile iPhone');
  }
  if (/Android/i.test(ua)) {
    return $body.addClass('mobile Android');
  }
  // if
  window.isMobile = false;
  if (/iPad/i.test(ua)) {
    return $body.addClass('iPad');
  }
  var $header = $('.rows-1');
  if (window.isMobile) {
    $header.addClass('fixed');
    $header.find('.nav-res').on('click', function () {
        $header.toggleClass('show-menu');
    });
    return;
  }
}();
