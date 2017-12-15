/**
 * Created by zjy on 2015/5/6.
 * edit By wangLei on 2016/8/24.
 */

// var  BASE_URL = "/task";
// var  BASE_URL = "http://192.168.3.137/task";
// var  BASE_URL = "http://beta.rishiqing.com/app";
// var  BASE_URL = "/app";
!function(a,b){function d(a){var e,c=b.createElement("iframe"),d="https://open.weixin.qq.com/connect/qrconnect?appid="+a.appid+"&scope="+a.scope+"&redirect_uri="+a.redirect_uri+"&state="+a.state+"&login_type=jssdk";d+=a.style?"&style="+a.style:"",d+=a.href?"&href="+a.href:"",c.src=d,c.frameBorder="0",c.allowTransparency="true",c.scrolling="no",c.width="179px",c.height="179px",e=b.getElementById(a.id),e.innerHTML="",e.appendChild(c)}a.WxLogin=d}(window,document);
var joinNewTeam = "/team/joinNewTeam";
var SPRING_CHECK = "/j_spring_security_check";
var usernameRegistered = "/reg/usernameRegistered";
var LIMIT_CHECK = "/v2/teamAssertJoin/show";
var  INVITE_CODE_CHECK = "/reg/ajaxInvite";
var emai = [
  '@163.com',
  '@126.com',
  '@gmail.com',
  '@qq.com',
  '@hotmail.com',
  '@sina.com',
  '@sina.cn',
  '@sohu.com',
  '@139.com',
  '@tom.cn',
  '@yeah.net',
  '@sogou.com',
  '@21cn.com',
  '@yahoo.com.cn',
  '@yahoo.cn',
  '@aol.com'
];
var emailMap = {
  '@163.com': 'http://mail.163.com',
  '@126.com': 'http://mail.126.com',
  '@gmail.com': 'https://mail.google.com',
  '@qq.com': 'https://mail.qq.com',
  '@hotmail.com': 'http://www.hotmail.com',
  '@sina.com': 'http://mail.sina.com.cn',
  '@sohu.com': 'http://mail.sohu.com',
  '@139.com': 'http://mail.10086.cn',
  '@tom.com': 'http://web.mail.tom.com',
  '@yeah.net': 'http://www.yeah.net',
  '@sogou.com': 'http://mail.sogou.com',
  '@21cn.com': 'http://mail.21cn.com',
  '@yahoo.com': 'http://mail.yahoo.com',
  '@aol.com': 'http://mail.aol.com'
};
var contactUs = "您还可以<a target='_blank' class='toUs' href='javascript:;' onclick = 'getService();'>在线咨询</a>";
var highLight = function (obj) {
  $("li.highLight").removeClass("highLight");
  $(obj).addClass("highLight");
};
!(function () {
  if (window.isMobile) {
    $('#regEmail').attr({'placeholder':'请输入您的手机号', 'pattern': '[0-9]'});
  }
})();

$.fn.disableBtn = function () {
  this.addClass('btn-disable');
};
$.fn.enableBtn = function () {
  this.removeClass('btn-disable');
};


var getEmail = function (obj) {
  var theUl = $(obj).parent();
  theUl.next().val($(obj).html());
  theUl.hide();
  var focInp = $("input:focus");
  if (focInp.parent().find(".blueBtn").length) {
    focInp.parent().find(".blueBtn").click();
  } else {
    focInp.parent().parent().find(".blueBtn").click();
  }
};

var getInvitedInfo = function (code, _success) {
    var data = {
        inviteCode: code
    };
    if (code) {
        data.isNotSecret = true;
    }
    var success = _success || function () {};
    $.ajax({
        url:
        BASE_URL + INVITE_CODE_CHECK,
        // type: 'POST',
        type: 'get',
        data: data,
        success: function (data) {
            var team = data;
            success(data);
        },error : function() {
        }
    });
};

var getService = function () {
  $('#online-kf').click();
};
$(function () {
// 【创建 并初始化 登录框控制器】
  var dlgControl = new DlgControl();
  dlgControl.init();
  // if (!$('body').hasClass('iPhone')) {
  //   $('.searchResult').css('left', ($(window).width() - 252) / 2 + 'px');
  // }

// 【方法扩展】（只给String扩展了一个endWidth方法）
  String.prototype.endWith = function (str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length) {
      return false;
    }
    return this.substring(this.length - str.length) == str;
  };
});
/*-----------窗口控制器-------------*/
function DlgControl () {
  return {
    init: function () {
      this.setEvent();
    },

// 【设置事件】
    setEvent: function () {
      var self = this;
      self.isResizing = false;
      self.resizing = null;

      // 点击中间的“立即进入”或者中间底部的“立即体验”，可以打开
      $(".soonIn").click(function () {
        if (window.isMobile) {
          return (location.href = '/i?port=1');
        }
        self.showBlank();
        self.showContainer($("#pageSoonLogin"));
        if (!self.soonInDialog) {
          self.soonInDialog = new SoonInDialog(self);
          self.soonInDialog.init();
        }
        self.soonInDialog.showWXCont();
      });

      // 点击右上角登录按钮，打开登录框
      $(".loginDialog").click(function () {
        window.location.href='/i?port=2'
      });

      // 点击右上角注册按钮，打开注册框
      $(".regDialog").click(function () {
        window.location.href='/i?port=1'
      });

      $("#logAvatar").click(function () {
        self.goToSystem();
      });
      // ESC消失
      $(window).keydown(function (e) {
        if (e.keyCode == 27 && !$(".mask").is(":hidden")) {
          self.hideDlg();
        }
      });

      // 调整窗口保持模态框在中间
      $(window).resize(function () {
        if (!self.isResizing) {
          self.isResizing = true;
          self.resizing = setTimeout(function () {
            self.resizeDlg();
            self.isResizing = false;
          }, 500);
        } else {
          clearTimeout(self.resizing);
          self.resizing = setTimeout(function () {
            self.resizeDlg();
            self.isResizing = false;
          }, 500);
        }
      });
    },
// 【窗口变化的时候，让窗口保持居中。】
    resizeDlg: function () {
      var $container = $('.popup');
      var windowHeight = $(window).height();
      var windowWidth = $(window).width();
      var top = (windowHeight - $container.height()) / 2;
      var left = (windowWidth - $container.width()) / 2;
      $container.css({ top: top, left: left });
    },

// 【显示空白窗口】
    showBlank: function () {
      var $blank = $('.popup');
      var height = $(document).height();
      var windowHeight = $(window).height();
      var windowWidth = $(window).width();
      var top = (windowHeight - $blank.height()) / 2;
      var left = (windowWidth - $blank.width()) / 2;
      $(".mask").height(height).show(); // 设定mask的高度 显示mask
      $blank.show(); // 显示空框
      $blank.css({ top: top, left: left }); // 设置空框居中
      setTimeout(function () {
        // $('.rows').addClass('blurFont'); // 虚化背景
        // $('.footer').addClass('blurFont');
        $('body').addClass('blurFont');
      }, 10);
    },

// 【隐藏空白窗口】
    hideDlg: function () {
      $(".popup").hide();
      $(".mask").hide();
      setTimeout(function () {
        // $('.rows').removeClass('blurFont');
        // $('.footer').removeClass('blurFont');
        $('body').removeClass('blurFont');
      }, 100);
    },

// 【显示特定内容(在空白窗口中)】
    showContainer: function ($container) {
      $('.popupContainer').removeClass('showing'); // 隐藏当前显示的主体
      $container.addClass('showing'); // 显示要显示的主体
      $container.find('input').val(''); // 清空input内容
      showErrorMsg(""); // 清空错误信息
      setTimeout(function () {
        // $container.find("input:visible:not(:disabled):first").focus(); // 聚焦
      }, 0);
    },

// 【进入系统】
    goToSystem: function (isSystemManager, isReg) {
      if (window.isDev) return alert('登录成功， 开发环境下不会自动进入系统'); // 开发环境下别动不动就进app的问题
      // return;
      isSystemManager = isSystemManager || false;
      // isReg = isReg === true ? true : false;
      // isSystemManager = isSystemManager === undefined ? false : isSystemManager;
      // isLog = isLog === undefined ? true : false;
      var downloadUrl = '/download.php';
      if (window.isMobile) {
        if (location.pathname === downloadUrl) return;
        return (location.href = downloadUrl + '?msg=' + (isReg === true ? '注册' : '登录'));
      }
      if (isSystemManager) {
        // window.location.href = BASE_URL + '/systemManage';
        window.location.href = BASE_URL + '/homePage';
      } else {
        window.location.href = '/app';
      }
    }
  }
}

var $hackError = window.isMobile ? $('.error-place-hack') : $('.errorPlace');
function showErrorMsg (html) {
  if (!$hackError.length && !window.isMobile) {
    $hackError = $('.errorPlace');
  }
  $hackError.html(html);
}
/*-----------快速登录----------------*/
function SoonInDialog (parent) {
  var $soonContianer = $("#pageSoonLogin");
  return {
    init: function () {
      this.setEvent();
    },

// 【设置事件】
    setEvent: function () {
      var self = this;
      var $remember = $soonContianer.find('.rememberPsw');
      var $rBox = $soonContianer.find('.rememberBox');

      $remember.on('click', function () {
        $rBox.toggleClass('active');
      });
      // 点击别处，下拉列表消失。
      $(document).click(function () {
        $(".emails input").prev().hide();
      });

      // 密码focus，下拉列表消失。
      $('.passwords').focus(function () {
        $(".emails input").prev().hide();
      });

      /* 用户名栏打字的时候，判断是否出现下拉框，下拉框内容。
       用户名栏按上下键时的反应。
       此处事件其实是规定了 正常的登录、注册，邀请的登录、注册 以及 找回密码等多处的出框事件。
       */
      $(".emails").keyup(function (e) {
        self.showEmailSelect(e);
      });

      // 回车登录
      $(document).keydown(function (e) {
        var $ul = $('.searchResult');
        if (e.keyCode == 13) {
          var focInp = $("input:focus");
          if (!$ul.is(":visible") || ($ul.is(":visible") && !$('.searchResult li').hasClass('highLight'))) {
            if (focInp.parent().find(".btn").length) {
              focInp.parent().find(".btn").click();
            } else {
              focInp.parent().parent().find(".btn").click();
            }
          }
        }
      });

      // 点X 窗口消失
      $(".cross").click(function () {
          parent.hideDlg();
          $(".options").hide();
          // $(".selectList").show();
        }
      );

      // 忘记密码按钮
      $(".findPsw").click(function () {
        window.location.href='/i?port=4';
      });

      // 微信切换按钮
      $soonContianer.find(".switchWX").click(function () {
        self.showWXCont();
      });
      // 微信刷新按钮
      $soonContianer.find(".icon-fresh").click(function () {
        self.freshWxCont();
      });
      $soonContianer.find(".freshText").click(function () {
        self.freshWxCont();
      });

      // QQ切换按钮
      $soonContianer.find(".switchQQ").click(function () {
        self.showQQCont();
      });

      // 登录切换按钮
      $soonContianer.find(".switchLogin").click(function () {
        self.showLoginCont();
      });

      // 点新注册用户，切换到注册页面
      $soonContianer.find(".newUserReg").click(function () {
        window.location.href='/i?port=1';
      });

      //点击登录按钮
      $soonContianer.find(".soonLogBtn").unbind().click(function () {
        if ($("#logBtn").attr('disabled')) {
          showErrorMsg('登录失败，请稍后重试。' + contactUs);
          return;
        }
        var loginCode = $soonContianer.find(".logEmail").val();               // 获取用户邮箱信息
        var pwd = $soonContianer.find(".logPassword").val();                  // 获取登录密码信息
        self.login();
      });

      // 点击QQ登录图标
      $soonContianer.find('.toQQLogin').on('click', function () {
        window.open('/task/qqOauth/toLogin');
      });
    },
    showErrorMsg: function (html) {
      this.$hackError.html(html);
    },

    /*---------------------事件设置结束----------------------*/
// 【备选邮箱下拉框】
    // 用户名栏按下鼠标的时候，判断是否出现下拉框。
    // 如果已经有下拉框，判断上、下、回车键后的反应。
    showEmailSelect: function (e) {
      var self = $(e.target);
      var kw = jQuery.trim(self.val());
      var searchResult = self.prev();
      var index = kw.indexOf("@");
      var startStr = kw.substring(0, index);
      var endStr = kw.substring(index);
      var reg = /.*[\u4e00-\u9fa5]+.*$/;
      var html = "";
      var divObj = searchResult.find("li");
      if (!searchResult.is(":hidden")) {
        if (e.keyCode == 40) {
          if (!divObj.hasClass("highLight")) {
            divObj.eq(0).addClass("highLight");
          } else {
            var temp = searchResult.find(".highLight");
            if (temp.next().html() != undefined) {
              temp.removeClass("highLight");
              temp.next().addClass("highLight");
            }
          }
        } else if (e.keyCode == 38 && !divObj.eq(0).hasClass("highLight")) {
          var temp2 = searchResult.find(".highLight");
          temp2.removeClass("highLight");
          temp2.prev().addClass("highLight");
        } else if (e.keyCode == 13) {
          searchResult.find(".highLight").click();
          e.stopPropagation();
          e.preventDefault();
        }
      }
      //　《隐藏情况》
      // 全清空要隐藏，
      // 前面清空要隐藏。
      // 没有@要隐藏，
      // 中文要隐藏。
      //          --好诗
      if (kw == "" || startStr == "" || index < 0 || reg.test(startStr)) {
        searchResult.hide();
        return false;
      }
      for (var i = 0; i < emai.length; i++) {
        if (emai[i].indexOf(endStr) >= 0) {
          html = html + "<li class='emailItem' onclick='getEmail(this);' onmouseover='highLight(this);'>" + startStr + emai[i] + "</li>"
        }
      }
      if (html != "" && e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 13) {
        searchResult.html(html).show();
        var $lis = searchResult.find('li');
        if (!$lis.hasClass("highLight")) {
          $lis.eq(0).addClass("highLight");
        }
      } else if (html == "") {
        searchResult.hide();
      }
    },

    // 显示QQ的内容
    showQQCont: function () {
      $soonContianer.find('.switcher ul li').removeClass('active');
      $soonContianer.find(".switchQQ").addClass('active');
      $soonContianer.find(".soonCont").hide();
      $soonContianer.find('.QQMain').show();
      showErrorMsg('');
    },

    // 显示微信框的内容
    showWXCont: function () {
      $soonContianer.find('.switcher ul li').removeClass('active');
      $soonContianer.find(".switchWX").addClass('active');
      $soonContianer.find(".soonCont").hide();
      $soonContianer.find('.WXMain').show();
      showErrorMsg('');
      this.freshWxCont();
    },

    freshWxCont: function(){
      var obj = new WxLogin({
        id:"login_container",
        appid: "wxf39b085a4d6ff3c7",
        scope: "snsapi_login",
        redirect_uri: "https://www.rishiqing.com/task/weixinOauth/afterLogin",
        state: "null_null_null_empty_empty_empty",
        style: "",
        href: "https://rsqsystem.oss-cn-beijing.aliyuncs.com/weixin/wx2ma.css"
      });
    },
    // 显示登陆框的内容
    showLoginCont: function () {
      $soonContianer.find('.switcher ul li').removeClass('active');
      $soonContianer.find(".switchLogin").addClass('active');
      $soonContianer.find(".soonCont").hide();
      $soonContianer.find('.soonLogMain').show();
      this.getCookie($soonContianer.find(".logEmail"), $soonContianer.find(".logPassword"));
      showErrorMsg('');
    },

    // 【密码功能】
    setCookie: function (userEmail, password, notCheck) { //设置cookie
      $.cookie("userEmail", userEmail, { expires: 90 });//调用jquery.cookie.js中的方法设置cookie中的用户邮箱
      if (!notCheck) { //判断是否选中了“记住密码”复选框
        $.cookie("notPsw", '');
        $.cookie("pwd", password, { expires: 90 });//调用jquery.cookie.js中的方法设置cookie中的登录密码，并使用base64（jquery.base64.js）进行加密
      } else {
        $.cookie("notPsw", true, { expires: 90 });
        $.cookie("pwd", '');
      }
    },
    getCookie: function ($userEmail, $password) { //获取cookie
      var loginCode = $.cookie("userEmail"); //获取cookie中的用户邮箱
      var pwd = $.cookie("pwd"); //获取cookie中的登录密码
      if (loginCode) {//用户邮箱存在的话把用户邮箱填充到用户邮箱文本框
        $userEmail.val(loginCode);
      }
      if (pwd) {//密码存在的话把密码填充到密码文本框
        $password.val(pwd);
      }
      if ($.cookie("notPsw")) {
        $('.rememberBox').removeClass('active');
      } else {
        $('.rememberBox').addClass('active');
      }
    },
// 【快速登录的点登录，发送登录请求】
    login: function () {
      var $loginCode = $soonContianer.find(".logEmail");
      var loginCode = $soonContianer.find(".logEmail").val();
      var $pwd = $soonContianer.find(".logPassword");
      var pwd = $soonContianer.find(".logPassword").val();
      var self = this;
      if (!loginCode) {
        $loginCode.focus();
        showErrorMsg("请输入邮箱或手机号")
        // showErrorMsg("请输入邮箱或手机号");
      } else if (!pwd) {
        $pwd.focus();
        showErrorMsg("请输入密码");
      } else if (pwd.length < 6) {
        $pwd.focus();
        showErrorMsg('密码不能小于6位');
      } else {
        var dataObj = {
          j_username: loginCode,
          j_password: pwd,
          _spring_security_remember_me: true
        };
        $.ajax({
          url: BASE_URL + SPRING_CHECK,
          data: dataObj,
          type: 'POST',
          success: function (data) {
            //登录成功
            if (data.success) {
              var notCheck = !$soonContianer.find('.rememberBox').hasClass('active');  // 获取是否有记住密码
              self.setCookie(loginCode, pwd, notCheck);
              if (data.notCommonUser) { // 如果不是普通用户(是我们日事清系统管理员)
                parent.goToSystem(true);
              } else {
                parent.goToSystem();
              }
            } else {
              if (data.errors && data.errors.message) {
                showErrorMsg(data.errors.message);
              } else {
                showErrorMsg('登录失败！' + contactUs);
              }
            }
          },
          error: function () {
            this.showErrorMsg('登录失败！' + contactUs);
          }
        })
      }
    },

// 【判断用户名是否有效，以及是否存在】
    usernameRegistered: function (userName, successCallBack) {
      var self = this;
      $.ajax({
        url: BASE_URL + usernameRegistered, type: 'POST', data: { userName: userName },
        success: function (data) {
          var result = data.data;
          if (!result.registered) {//用户名不存在
            successCallBack.call(self);
          } else {//用户名已存在
            showErrorMsg("该用户名已存在");
          }
        },
        error: function () {
          showErrorMsg("用户名有效性验证失败，请重试");
        }
      })
    }
  }
}
!function () {
  var BASE_URL = '/task';
  !function(a,b){function d(a){var e,c=b.createElement("iframe"),d="https://open.weixin.qq.com/connect/qrconnect?appid="+a.appid+"&scope="+a.scope+"&redirect_uri="+a.redirect_uri+"&state="+a.state+"&login_type=jssdk";d+=a.style?"&style="+a.style:"",d+=a.href?"&href="+a.href:"",c.src=d,c.frameBorder="0",c.allowTransparency="true",c.scrolling="no",c.width="179px",c.height="179px",e=b.getElementById(a.id),e.innerHTML="",e.appendChild(c)}a.WxLogin=d}(window,document);
  var joinNewTeam = "/team/joinNewTeam";
  var SPRING_CHECK = "/j_spring_security_check";
  var usernameRegistered = "/reg/usernameRegistered";
  var REG_URL = "/reg/register";
  var wxAuth = "/weixinOauth/toLogin";
  var qqAuth = "/qqOauth/toLogin";
  var sinaAuth = "/sinaOauth/toLogin";
  var phoneRegistered = "/reg/phoneRegistered";
  var validateSmsWithPhone = "/reg/validateSmsWithPhone";
  var emai = [
    '@163.com',
    '@126.com',
    '@gmail.com',
    '@qq.com',
    '@hotmail.com',
    '@sina.com',
    '@sina.cn',
    '@sohu.com',
    '@139.com',
    '@tom.cn',
    '@yeah.net',
    '@sogou.com',
    '@21cn.com',
    '@yahoo.com.cn',
    '@yahoo.cn',
    '@aol.com'
  ];
  var emailMap = {
    '@163.com': 'http://mail.163.com',
    '@126.com': 'http://mail.126.com',
    '@gmail.com': 'https://mail.google.com',
    '@qq.com': 'https://mail.qq.com',
    '@hotmail.com': 'http://www.hotmail.com',
    '@sina.com': 'http://mail.sina.com.cn',
    '@sohu.com': 'http://mail.sohu.com',
    '@139.com': 'http://mail.10086.cn',
    '@tom.com': 'http://web.mail.tom.com',
    '@yeah.net': 'http://www.yeah.net',
    '@sogou.com': 'http://mail.sogou.com',
    '@21cn.com': 'http://mail.21cn.com',
    '@yahoo.com': 'http://mail.yahoo.com',
    '@aol.com': 'http://mail.aol.com'
  };
  var emailStr = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/; // 邮箱验证
  // var phoneStr = /^1[3|4|5|8][0-9]\d{8}$/; // 手机号验证
  // var phoneStr = /^1[3|4|5|7|8][0-9]\d{8}$/; // 手机号验证
  var phoneStr = /^\d{11}$/;

  String.prototype.includes = String.prototype.includes || function (str) {
    return this.indexOf(str) !== -1;
  };

  var template = '';

  var $body = $('body');
  $('.login-by-MM').click(function () {
    $body.addClass('show-mask');
  });
  $(document).click(function (e) {
    var $tar = $(e.target);
    if ($tar.hasClass('login-by-MM')) return;
    if ($tar.hasClass('mail-item')) return;
    if (!$tar.parents('.mask-box').length) {
      $body.removeClass('show-mask');
    }
  });



  // var RegDialog = function () {};
  function RegDialog () {}

  RegDialog.prototype = {
    initReg: function ($par) {
      this.$root = $par;
      this.$user = $par.find('.email');
      this.$pass = $par.find('.password');
      this.$name = $par.find('.username');
      this.$msg = $par.find('.error-msg');
      this.$mail = $par.find('.sign-up-mail');
      this.$phone = $par.find('.sign-up-phone');
      this.$emailList = $par.find('.email-list');
      this.$regBtn = $par.find('.sign-up-btn');

      this.bindEvents();

      // this.initForPhone();

      this.getWXIMG();
      // this.startCount();
    },
    setEmailList: function (html) {
      this.$emailList.html(html);
      this.setActive();
    },
    clearEmailList: function () {
      this.$emailList.empty();
      this.$emailList[0].activeEle = null;
    },
    setActive: function ($tar) {
      var $el = this.$emailList;
      if (!$tar || ($tar && $tar.length === 0)) {
        $tar = $el.find('li:first');
      }
      $tar.addClass('active');
      if ($el[0].activeEle) {
        $el[0].activeEle.removeClass('active');
      }
      $el[0].activeEle = $tar;
    },
    bindEvents: function () {
      this.bindKeyUpEvents();
      this.bindKeyDownEvents();
      this.bindRegBtnClickEvents();
      this.bindEmailListClickEvents();
      this.bindWXevents();
    },
    bindKeyUpEvents: function () {
      var _this = this;
      this.$user.keyup(function (e) {
        var $this = $(this), val = $this.val(),
            index = val.indexOf('@'),
            suffix = val.slice(index),
            html = '',
            $emailList = _this.$emailList;

        if (index === -1 || index === 0) return _this.clearEmailList();
        if ([38, 13, 40].indexOf(e.keyCode) !== -1) return;
        emai.filter(function (item) {
          return item.includes(suffix);
        }).forEach(function (item) {
          html += '<li class = "mail-item">' + val.slice(0, index) + item + '</li>';
        });
        _this.setEmailList(html);
      });
    },
    prevent: function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    bindKeyDownEvents: function () {
      var _this = this;
      this.$user.keydown(function (e) {
        var code = e.keyCode, $list = _this.$emailList, $active = $list[0].activeEle, $tar = null;
        if (!$active) return;
        if (code === 13 && $active) {
          _this.isSelectItem = true; // 状态判断
          // _this.prevent(e);
          $active.click();
          return;
        }
        if (code !== 38 && code !== 40) return;
        if (code === 38) { // up
          $tar = $active.index() === 0 ? $list.find('li:last') : $active.prev('li');
        }
        if (code === 40) { // down
          $tar = $active.index() === $list[0].childElementCount ? $list.find('li:first') : $active.next('li');
        }

        _this.setActive($tar);
        _this.prevent(e);

        $list.animate({
          scrollTop: $tar.index() * 26 + 'px'
        }, 0);
      });


      this.$root.find('ul:first input').keydown(function(e) {
        if (e.keyCode === 13 && _this.isSelectItem === false) {
          _this.$regBtn.click();
        } else {
          _this.isSelectItem = false;
        }
      });
    },
    bindEmailListClickEvents: function () {
      var _this = this;
      this.$emailList.on('click', 'li', function (e) {
        var $target = $(e.target), $list = _this.$emailList, $email = _this.$user;
        $email.val($target.text());
        _this.clearEmailList();
      });
      this.$user.blur(function () {
        setTimeout(function () {
          _this.clearEmailList();
        }, 10);
      });
    },
    bindRegBtnClickEvents: function () {
      var _this = this;
      this.$regBtn.click(function () {
        var $user = _this.$user,
          $pass = _this.$pass,
          $name = _this.$name,
          $msg = _this.$msg;
        var username = $user.val(), password = $pass.val(), realName = $name.val();
        if (!emailStr.test(username) && !phoneStr.test(username)) {
          return _this.showErrorMsg('用户名错误， 请输入邮箱或手机号');
        }
        if (password.length < 6) {
          return _this.showErrorMsg('密码不能小于6位');
        }
        if (realName === '') {
          return _this.showErrorMsg('请输入您的真实姓名');
        }
        _this.showErrorMsg('');
        if (phoneStr.test(username)) {
          _this.setForPhone(username);
        } else {
          _this.setForMail(username);
        }
      });
    },
    showErrorMsg: function (err) {
      this.$msg.html(err);
    },
    clearMsg: function () {
      this.$msg.html('');
    },
    setForPhone: function (username) {
      var _this = this;
      $.post(BASE_URL + phoneRegistered, { phoneNumber: username })
        .done(function (res) {
          if (res.data.registered) {
            return _this.showErrorMsg('该手机号已存在');
          }
          _this.showPhone(username);
        })
        .fail(function () {
          _this.showErrorMsg('手机号验证失败， 请重试');
        });
    },
    setForMail: function (username) {
      var _this = this;
      $.post(
        BASE_URL + REG_URL,
        {
          username: username,
          password: _this.$pass.val(),
          realName: _this.$name.val(),
          createdByClient: "web"
        })
        .done(function (res) {
          if (res.success) {
            return _this.showMail(username);
          }
          _this.showErrorMsg('注册失败，请再次尝试');
        })
        .fail(function () {
          _this.showErrorMsg('注册失败，请再次尝试');
        });
    },
    showMail: function (username) {
      this.$root.addClass('show-mail');
      this.$root.find('.email-addr').text(username);
      this.$root.find('.login-mail').attr('href', emailMap[username.slice(username.indexOf('@'))]);
    },
    showPhone: function (username) {
      this.initForPhone(username);
      this.startCount(username);
      this.$root.addClass('show-phone');
      this.$root.find('.phone-number').val(username);
    },
    initForPhone: function (username) {
      this.$reSend = this.$root.find('.re-send');
      // this.$msg = this.$root.find('.sign-up-phone > span');
      this.timer = null;
      // this.$confirm = this.$root.find('.confirm');
      this.$valiCode = this.$root.find('.validate-code');
      this.bindConfirmClickEvents(username);
      this.bindReSendClickEvents();
    },
    bindConfirmClickEvents: function (username) {
      var _this = this;
      this.$root.find('.confirm').click(function () {
        var code = _this.$valiCode.val();
        if (!/^[0-9]{4}$/.test(code)) return _this.showErrorMsg('请输入有效的4位数字验证码');
        _this.validateCode(username, code);
      });
    },

    validateCode: function (username, code) {
      var _this = this;
      $.post(
        BASE_URL + validateSmsWithPhone,
        {
          phone: username, valicode: code
        }
        )
      .done(function (res) {
        if (!res.success) return _this.showErrorMsg('验证失败， 请重试');
        _this.signUpByPhone(username);
      })
      .fail(function () {
        _this.showErrorMsg('注册失败， 请重试');
      });
    },
    signUpByPhone: function (username) {
      var _this = this;
      $.post(
        BASE_URL + REG_URL,
        {
          username: username + '@rishiqing.com',
          phoneNumber: username,
          password: _this.$pass.val(),
          realName: _this.$name.val(),
          client: "webByPhone"
        }
        )
      .done(function (res) {
        if (!res.success) return _this.showErrorMsg('注册失败， 请重试');
        location.href = '/app';
      })
      .fail(function () {
        _this.showErrorMsg('注册失败， 请重试');
      });
    },
    bindReSendClickEvents: function () {
      var _this = this;
      this.$reSend.click(function () {
        _this.startCount(_this.$user.val());
      });
    },
    startCount: function (username) {
      if (this.timer) return;
      var number = 60, _this = this;
      this.sendCode(username, function (err) {
        if (err !== null) return;
        _this.$reSend.text(number--).addClass('disable');
        _this.timer = setInterval(function () {
          if (number === 0) return _this.endCount();
          _this.$reSend.text(number--);
        }, 1000);
      });
    },
    endCount: function () {
      this.$reSend.removeClass('disable').text('重发');
      clearInterval(this.timer);
      this.timer = null;
    },
    sendCode : function (username, _cb) {
      var cb = _cb || function () {};
      var visualMacCode = "qc:qc:qc:qc";
      var sendCellphoneCode = "/reg/sendCellphoneValidataCode";
      var _this = this;
      $.ajax({
        url: BASE_URL + sendCellphoneCode, type: 'POST', data: { phone: username, phoneMac: visualMacCode },
        success: function (data) {
          if (!data.success) {
            if (data.errors) {
              _this.showErrorMsg(data.errors);
              cb(data);
            } else {
              _this.showErrorMsg("发送失败，请稍候重试.");
              cb(data);
            }
          } else {
            _this.showErrorMsg("验证码发送成功");
            _this.showErrorMsg("");
            cb(null);
          }
        },
        error: function (err) {
          _this.showErrorMsg("验证码发送失败,请稍候重试");
          cb(err);
        }
      })
    },
    getWXIMG: function () {
      new WxLogin({
        id:"login_container",
        appid: "wxf39b085a4d6ff3c7",
        scope: "snsapi_login",
        redirect_uri: "https://www.rishiqing.com/task/weixinOauth/afterLogin",
        state: "null_null_null_empty_empty_empty",
        style: "",
        href: "https://rsqsystem.oss-cn-beijing.aliyuncs.com/weixin/wx2ma.css"
      });
    },
    bindWXevents: function () {
      var _this = this;
      $('.refresh').on('click', '.r', function () {
        _this.getWXIMG();
      });
    }
  };


  $('.sign-up').each(function (index, item) {
    new RegDialog().initReg($(item));
  });
}();
