(function ($){
	// rows-2 安排日常任务
	//var banner=$('.banner');
	//var picBox=banner.find('.pic-box');
	//var ctrl=banner.find('.ctrl');
	//var spanCtrl=banner.find('.ctrl').find('span');
	//
	//spanCtrl.bind("mouseover",function (){
	//	var index=$(this).index();
	//	picBox.children('img').hide()
	//		  .eq(index).fadeIn(300);
	//});
	//
	//spanCtrl.bind("mouseout",function (){
	//	picBox.children('img').hide();
	//	picBox.children('.active').fadeIn(300);
	//});
	//
	//ctrl.bind('click',function (e){
  //
	//	var target=$(e.target).parent();
	//	var index=target.index();
	//	picBox.children().removeClass('active');
	//	target.siblings().removeClass('active');
  //
	//	target.addClass('active');
	//	picBox.children().eq(index).addClass('active').fadeIn(100);
	//});

  var mediaView=$('.rows-5').find("ul").find('li');
  var $captions = $(".caption>p");
  mediaView.bind('click',function (){
    var $this = $(this), index = $this.index();
    var siblings=$(this).siblings();
    for (var i=0, len=siblings.length;i < len; i++) {
      var mediaLogo=siblings.eq(i).find('img');
      var bannerCtrl=siblings.eq(i).find('span');
      var src=mediaLogo.prop('src');
      mediaLogo.prop("src",src.replace(/(\w*).jpg/,"$1.png"));
      bannerCtrl.removeClass('active');
    };
    var src=$(this).find('img').prop("src");
    $this.find('img').prop("src",src.replace(/(\w*).png/,"$1.jpg"));
    $this.find('span').addClass('active');
    $captions.eq(index).show().siblings().hide();
  });
}(jQuery));

