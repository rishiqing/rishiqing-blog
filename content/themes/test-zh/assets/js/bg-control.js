(function ($) {
        var img=$('.bg-img').find('img');
        $(window).bind('resize',function (){
          //var width=$('body').width();
          var width=img.width();
          /*
          console.log(
          'body-width: '+width
          +'\nimg-left: '+img.css('left')
          +'\nimg.width: '+img.width()
          +'\nimg.top: '+img.css('top')
          +'\nimg.height: '+img.height());
          */
          img.css({'margin-left':-width/2,'top':'0'});
          //console.log(img.css('margin-left'));
        });
        $(window).bind('load',function () {
        console.log('hello');
          $(window).trigger('resize');
        })
      }(jQuery));