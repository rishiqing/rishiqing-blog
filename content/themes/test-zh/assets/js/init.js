/*
* @Author: Jiang Guoxi
* @Date:   2016-10-24 09:31:38
* @Last Modified by:   Jiang Guoxi
* @Last Modified time: 2016-10-25 15:11:56
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
}();
!function () {
  var $header = $('.header'), $nav = $header.find('.nav'), $divider = $header.find('.divider');
  if (window.isMobile) {
    $header.addClass('fixed');
    $header.find('.nav-res').on('click', function () {
        $header.toggleClass('show-menu');
    });
    setSlider();
    return;
  }
  function setSlider () {
    var HEIGHT = $(window).height(), menuHeight = (HEIGHT - 50) * 0.8,
        topHeight = (230 / 320) * menuHeight,
        itemHeight = topHeight / 7,
        bottomHeight = menuHeight - topHeight,
        bottomPadTop = (bottomHeight - 60) / 2;

    $nav.css({ 'height': menuHeight/*, 'padding-top': (itemHeight - 20) + 'px' */});
    $divider.prevAll('li').each(function () {
      $(this).css('line-height', itemHeight + 'px');
    });
    $divider.css('margin-bottom', bottomPadTop + 'px');
  }
}();
