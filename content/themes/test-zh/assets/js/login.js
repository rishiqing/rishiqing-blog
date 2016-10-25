/**
 * Created by zjy on 2015/5/6.
 * edit By wangLei on 2016/8/24.
 */

// var  BASE_URL = "/task";
// var  BASE_URL = "http://192.168.3.137/task";
// var  BASE_URL = "http://beta.rishiqing.com/app";
// var  BASE_URL = "/app";
// var BASE_URL = 'https://www.rishiqing.com/task/';
var BASE_URL = '/task';
// var BASE_URL = '/task/';
// var BASE_URL = '/task/';


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
var phoneStr = /^1[3|4|5|8][0-9]\d{8}$/; // 手机号验证
var regParam = $("#regParam").val();
var uidParam = $("#uidParam").val();
var nowTeam = null;
var contactUs = "您还可以<a target='_blank' class='toUs' href='javascript:;' onclick = 'getService();'>在线咨询</a>";
var highLight = function (obj) {
  $("li.highLight").removeClass("highLight");
  $(obj).addClass("highLight");
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
var getService = function () {
  $('#kf5-support-btn').click();
};
var loginUtil = new LoginUtils();

var $loginBox = $('.log-reg');

$(function () {
// 【创建 并初始化 登录框控制器】
  var dlgControl = new DlgControl();
  dlgControl.init();

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
  var AUTH_ACTION = "/login/authAjax";
  var INVITE_CODE_CHECK = "/reg/ajaxInvite";
  return {
    init: function () {
      this.setEvent();
      this.initPageStatus(); // 判断登录状态/邀请状态，来决定是否自动进入系统，以及显示什么窗口。
      this.loginDialog = new LoginDialog(this);
      this.loginDialog.init();
    },

    showGoToSystem: function () {
      $loginBox.children().each(function() {
        $(this).off();
      });
      $loginBox.html('<a title="返回工作台" href="https://www.rishiqing.com/app" class="reback register">返回工作台</a>');
    },
// 【设置事件】
    setEvent: function () {
      var self = this;
      self.isResizing = false;
      self.resizing = null;

      // 点击中间的“立即进入”或者中间底部的“立即体验”，可以打开
      $(".soonIn").click(function () {
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
        self.showBlank();
        self.showContainer($("#pageRegLog"));
        self.loginDialog.showLog();
      });

      // 点击右上角注册按钮，打开注册框
      $(".regDialog").click(function () {
        self.showBlank();
        self.showContainer($("#pageRegLog"));
        self.loginDialog.showReg();
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

// 【刚进入页面，判断是直接登录、显示跳槽窗口，还是什么都不显示】
    /**
     * 如果已经登录，没有收到邀请，则直接进入工作台
     *
     * 如果已登录，收到邀请，则弹出是否更换公司窗口
     *
     * 如果未登录，没有收到邀请，则页面无操作
     *
     * 如果未登录，收到邀请，则自动弹出邀请进入公司窗口
     *
     */
    initPageStatus: function () {
      var self = this;
      //邀请码
      var inviteCode = $("#inviteCode").val();
      //判断用户是否已经登录
      $.ajax({
        url: BASE_URL + AUTH_ACTION,
        type: 'POST',
        success: function (data) {
          console.info(data);
          debugger;
          if (data.success) { //已登录、
            return self.showGoToSystem();
            // if (data.notCommonUser) {//如果不是普通用户
            //   // self.goToSystem(true);
            //   self.showGoToSystem();
            //   return;
            // }
            // window.USER_INFO = data;
          } else {//未登录
            if (inviteCode != "") { //存在邀请码参数
              // 查询邀请码对应的公司是否存在
              $.ajax({
                url: BASE_URL + INVITE_CODE_CHECK,
                type: 'POST',
                data: { inviteCode: inviteCode },
                success: function (data) {
                  if (data.success) { //邀请码正确
                    nowTeam = data;
                    var $invit = $("#invitedPeople");
                    self.showBlank();
                    self.showContainer($invit); // 显示邀请引导页
                    console.log(nowTeam);
                    $invit.find(".teamName").html(nowTeam.name);
                  }
                },
                error: function () {
                  //alert("system error");
                }
              });
            }
          }
        },
        error: function () {
          console.log("登录状态判断失败，请检查错误");
        }
      })
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
      }, 100);
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
      $container.find('input').val(''); // 清空inpnt内容
      $('.errorPlace').html(""); // 清空错误信息
      setTimeout(function () {
        $container.find("input:visible:not(:disabled):first").focus(); // 聚焦
      }, 0);
    },

// 【进入系统】
    goToSystem: function (isSystemManager) {
      if (isSystemManager) {
        window.location.href = BASE_URL + '/systemManage';
      } else {
        // window.location.href = '/app';
        window.location = 'https://www.rishiqing.com/app';
      }
    }
  }
}

/*-----------登录、注册----------------*/
function LoginDialog (parent) {
  return {
    init: function () {
      this.setEvent();
      this.initOtherAuthLogin(); // 设置3个社会化登录的链接（包括邀请链接）。
      if (regParam && uidParam) { // 可能已经不会调用到了。uid跟过去的邀请送会员有关。
        parent.showBlank();
        parent.showContainer($("#pageRegLog"));
        this.showReg();
      }
    },

// 【设置事件】
    setEvent: function () {
      var self = this;
      var $regLog = $("#pageRegLog");


      // 登录切换按钮
      $regLog.find(".switchLog").click(function () {
        self.showLog();
      });

      // 注册切换按钮
      $regLog.find(".switchReg").click(function () {
        self.showReg();
      });

      //点击登录按钮
      $("#logBtn").unbind().click(function () {
        if ($("#logBtn").attr('disabled')) {
          console.log('disabled');
          $('.errorPlace').html('登录失败，请稍后重试。' + contactUs);
          return;
        }
        var loginCode = $("#logEmail").val();               // 获取用户邮箱信息
        var pwd = $("#logPassword").val();                  // 获取登录密码信息
        var checked = $("[name='checkboxLogin']:checked");  // 获取“是否记住密码”复选框
        self.setCookie(loginCode, pwd, checked);
        self.login();
      });

      // 点击注册按钮
      $("#regBtn").unbind().click(function () {
        if ($("#regBtn").attr('disabled')) {
          console.log('disabled');
          $('.errorPlace').html('请稍后重试。' + contactUs);
          return;
        }
        self.regIn();
      });

      // 点击别处，下拉列表消失。
      $(document).click(function () {
        $(".emails").prev().hide();
      });

      // 密码focus，下拉列表消失。
      $('.passwords').focus(function () {
        $(".emails").prev().hide();
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
            if (focInp.parent().find(".blueBtn").length) {
              focInp.parent().find(".blueBtn").click();
            } else {
              focInp.parent().parent().find(".blueBtn").click();
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
        self.showFindPasswordDialog();
      });

      // 通过邀请链接，未登录，出现引导页后，点“已有账户”按钮，进行登录。
      $("#inviteLogin1").unbind().click(function () { // 已有账户，登录
        parent.showContainer($("#pageRegLog"));
        self.showLog();
      });

      // 通过邀请链接，未登录，出现引导页后，点“立即注册新账户”按钮，进行注册。
      $("#inviteReg1").unbind().click(function () { // 立即注册新账户
        parent.showContainer($("#pageRegLog"));
        self.showReg();
      });
    },

    /*---------------------事件设置结束----------------------*/

    // 显示登陆框的内容
    showLog: function () {
      var $regLog = $("#pageRegLog");
      $regLog.find('.switcher ul li').removeClass('active');
      $regLog.find(".switchLog").addClass('active');
      $regLog.find("form").hide();
      $('#logMain').show();
      $('.switchBar').css('left', '51px');
      this.getCookie($("#logEmail"), $("#logPassword"));
      $regLog.find("input:visible:not(:disabled):first").focus(); // 聚焦
      $("[name='checkboxLogin']").attr('checked', !$.cookie("notPsw")); // 设置复选框勾选状态
      $('.errorPlace').html('');
    },

    // 显示注册框的内容
    showReg: function () {
      var $regLog = $("#pageRegLog");
      $regLog.find('.switcher ul li').removeClass('active');
      $regLog.find(".switchReg").addClass('active');
      $('.switchBar').css('left', '142px');
      $regLog.find("form").hide();
      $('#regMain').show();
      $regLog.find("input:visible:not(:disabled):first").focus(); // 聚焦
      $('.errorPlace').html('');
    },

// 【点登录，发送登录请求】
    login: function () {
      var self = this;
      var loginCode = $("#logEmail").val(); //获取用户邮箱/手机信息
      var pwd = $("#logPassword").val(); //获取登录密码信息
      if (!loginCode) {
        $('.errorPlace').html("请输入邮箱或手机号");
        $('#logEmail').focus();
      } else if (!pwd) {
        $('.errorPlace').html("请输入密码");
        $('#logPassword').focus();
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
              console.log(data);
              if (nowTeam) { //如果是从邀请进来的，登录的时候需要判断是否加入新团队之类的。
                var orgTeam = data.team;
                if (orgTeam) {//已经存在团队
                  //判断新团队和旧团队是否为同一个团队
                  if (orgTeam.id == nowTeam.id) {//是同一个团队，则直接进入系统
                    parent.goToSystem();
                  } else { // 不是同一个团队，弹出跳槽窗口
                    parent.showContainer($("#choseOne"));
                    self.showChoseOneDialog(nowTeam);
                  }
                } else {//不存在团队 加入新团队
                  $.ajax({
                    url: BASE_URL + joinNewTeam, type: 'POST', data: { teamId: nowTeam.id },
                    success: function (data) {
                      if (data.success) {
                        parent.goToSystem();
                      } else {
                        alert("操作失败，请重试");
                      }
                    },
                    error: function () {
                      //alert("system error");
                    }
                  })
                }
              } else {
                if (data.notCommonUser) { // 如果不是普通用户(是我们日事清系统管理员)
                  parent.goToSystem(true);
                } else {
                  parent.goToSystem();
                }
              }
            } else {
              if (data.errors && data.errors.message) {
                $('.errorPlace').html(data.errors.message);
              } else {
                $('.errorPlace').html('登录失败！' + contactUs);
              }
            }
          },
          error: function () {
            $('.errorPlace').html('登录失败！' + contactUs);
          }
        })
      }
    },

//  【点注册，跳转相应页面】
    regIn: function () {
      var self = this;
      var $email = $("#regEmail");
      var $psw = $("#regPassword");
      var $name = $("#regRealName");
      var username = jQuery.trim($email.val()); //获取用户邮箱信息
      var password = $psw.val();                //获取密码信息
      var realName = jQuery.trim($name.val());  //获取密码信息
      if (!username) {
        $email.focus();
        $('.errorPlace').html("请输入邮箱或手机号");
      } else if (!emailStr.test(username) && !phoneStr.test(username)) {
        $('.errorPlace').html('用户名格式错误，应该是邮箱或者手机号。')
      } else if (!password) {
        $psw.focus();
        $('.errorPlace').html("请输入密码");
      } else if (password.length < 6) {
        $psw.focus();
        $('.errorPlace').html("密码不能小于6位");
      } else if (!realName) {
        $name.focus();
        $('.errorPlace').html("请输入您的真实姓名");
      } else if (phoneStr.test(username)) {
        //判断手机号是否已存在
        $.ajax({
          url: BASE_URL + phoneRegistered, type: 'POST', data: { phoneNumber: username },
          success: function (data) {
            var result = data.data;
            if (!result.registered) {
              loginUtil.sendSmsBtn(username);
              self.showPhoneRegDlg(username, password, realName);
            } else {
              $('.errorPlace').html("该手机号已存在");
            }
          },
          error: function () {
            $('.errorPlace').html("手机号验证失败，请重试");
          }
        });
      } else if (emailStr.test(username)) {
        var data = {
          username: username,
          password: password,
          realName: realName,
          createdByClient: "web"
        };
        self.usernameRegistered(username, function () {
          var data = {
            username: username,
            password: password,
            realName: realName,
            createdByClient: "web"
          };
          if (regParam)data.reg = regParam;
          if (uidParam)data.uid = uidParam;
          if (nowTeam) {
            data.userFrom = 3; // 默认同事邀请
            data.t = nowTeam.joinToken;
          }
          var ajaxObj = {
            url: BASE_URL + REG_URL,
            data: data,
            type: 'POST',
            msg: '注册',
            success: function (e) {
              if (e.success) { // 注册成功
                self.showRegSuccessDlg(data.username);
              } else { // 错误，可能是邮箱已存在
                var errors = e.errors;
                var error = e.error;
                if (errors) {
                  $('.errorPlace').html(errors);
                } else if (error) {
                  $('.errorPlace').html(error);
                } else {
                  $('.errorPlace').html("注册失败，请再次尝试" + contactUs);
                }
              }
            },
            error: function () {
              $('.errorPlace').html("注册失败，请再次尝试" + contactUs);
            }
          };
          if (nowTeam) {
            ajaxObj.headers = {
              "Access-Control-Allow-Headers": "X-Requested-With"
            }
          }
          $.ajax(ajaxObj)
        })
      }
    },

// 【显示“请输入验证码”窗口（点注册后，如果是手机号）】
    showPhoneRegDlg: function (phoNum, password, realName) {
      var self = this;
      var _$phoneReg = $("#phoneReg"); //整个弹窗
      var rePhone = $("#regReInputPho"); //电话号码input
      var reSendBtn = $("#regReSendMessage"); //重发按钮
      rePhone.attr("disabled", true).addClass('disabled'); //禁止输入
      // 【点击确定，以及点击重发的事件】
      _$phoneReg.find("#regMessageCommit").unbind().click(function () {//当确认按钮点击时
        var valicode = _$phoneReg.find("#regValidateCode").val(); //获取验证码信息
        if (!rePhone.val()) {
          $('.errorPlace').html("请输入邮箱或手机号");
        } else if (!valicode) {
          $('.errorPlace').html("请输入验证码");
        } else {
          var phone = $("#regReInputPho").val();
          //开始验证信息
          $.ajax({
            url: BASE_URL + validateSmsWithPhone,
            type: 'POST',
            data: { phone: phone, valicode: valicode },
            success: function (e) {
              if (e.success) {
                var data = {
                  username: phone + '@rishiqing.com',
                  phoneNumber: phone,
                  password: password,
                  realName: realName,
                  client: "webByPhone"
                };
                if (regParam)data.reg = regParam;
                if (uidParam)data.uid = uidParam;
                if (nowTeam) {
                  data.t = nowTeam.joinToken
                }
                $.ajax({
                  url: BASE_URL + REG_URL, type: 'POST',
                  data: data,
                  success: function (data) {
                    if (data.success) {
                      parent.goToSystem();
                    } else {
                      if (data.errors) {
                        $('.errorPlace').html(data.errors);
                      } else {
                        $('.errorPlace').html('注册失败，请稍候重试' + contactUs);
                      }
                    }
                  },
                  error: function () {
                    $('.errorPlace').html("注册失败，请稍候重试" + contactUs);
                  }
                })
              } else {
                var msg = e.msg;
                if (msg) {
                  $('.errorPlace').html(msg);
                } else {
                  $('.errorPlace').html("注册失败，请稍候重试");
                }

              }
            },
            error: function () {
              $('.errorPlace').html("验证失败，请重试");
            }
          })
        }
      });
      _$phoneReg.find(".reSend").unbind().click(function () {
        console.log('点重发');
        if (!reSendBtn.hasClass('reading')) {
          if (!rePhone.val()) {
            $('.errorPlace').html("请输入手机号码");
          } else if (!phoneStr.test(rePhone.val())) {
            $('.errorPlace').html("手机号码格式错误");
          } else {
            var phoneNum = rePhone.val();
            $.ajax({
              url: BASE_URL + phoneRegistered, type: 'POST', data: { phoneNumber: phoneNum },
              success: function (data) {
                var result = data.data;
                if (!result.registered) { //手机号不存在
                  loginUtil.sendSmsBtn(phoneNum);
                } else {
                  $('.errorPlace').html("该手机号已存在");
                }
              },
              error: function () {
                $('.errorPlace').html("手机号验证失败，请重试");
              }
            });
            loginUtil.interval(reSendBtn, function () {
              rePhone.attr('disabled', false).removeClass('disabled');
            });
            rePhone.attr("disabled", true).addClass("disabled");
          }
        }
      });
      loginUtil.interval(reSendBtn, function () {
        rePhone.attr('disabled', false).removeClass('disabled');
      });
      parent.showContainer(_$phoneReg);
      rePhone.val(phoNum); //电话input设置成刚输入的电话号
    },

//【显示邮箱注册成功，要去邮箱验证的窗口】
    showRegSuccessDlg: function (checkEmail) {
      var regSuccessDlg = $("#regSuccessDlg"); // 整个框
      var cheEmail = $("#checkEmail"); // Email框
      console.log(checkEmail);
      cheEmail.attr("disabled", true).addClass('disabled'); // 禁止输入
      // 点 去验证
      regSuccessDlg.find("#toCheckEmail").unbind().click(function () {
        if (!emailStr.test(cheEmail.val())) {
          $('.errorPlace').html("邮箱格式错误");
        } else {
          var flag = false;
          for (var key in emailMap) {
            if (cheEmail.val().endWith(key)) {
              window.open(emailMap[key]);
              flag = true;
            }
          }
          if (flag == false) {
            $('.errorPlace').html("找不到邮箱地址，请手动登录验证！");
          }
        }
      });
      parent.showContainer(regSuccessDlg);
      cheEmail.val(checkEmail); // 设置邮箱值
    },

// 【点记住密码功能】
    /*---勾选“记住密码”，点击登录，保存cookie，下次登录不需输入；
     不勾“记住密码”，点击登录，不保存cookie，下次登录需输入；
     默认是选中记住密码的。除非手动不选中，下次才不会选中--------------*/
    setCookie: function (userEmail, password, checked) { //设置cookie
      console.log(checked);
      if (checked && checked.length > 0) { //判断是否选中了“记住密码”复选框
        $.cookie("notPsw", '');
        $.cookie("userEmail", userEmail, { expires: 365 });//调用jquery.cookie.js中的方法设置cookie中的用户邮箱
        $.cookie("pwd", password, { expires: 365 });//调用jquery.cookie.js中的方法设置cookie中的登录密码，并使用base64（jquery.base64.js）进行加密
      } else {
        $.cookie("notPsw", true, { expires: 365 });
        $.cookie("pwd", '');
      }
    },
    getCookie: function ($userEmail, $password) { //获取cookie
      if ($.cookie("notPsw")) {
        $.cookie("pwd", '')
      }
      if ($.cookie("userEmail")) {//用户邮箱存在的话把用户邮箱填充到用户邮箱文本框
        $userEmail.val($.cookie("userEmail"));
      }
    },

// 【点击忘记密码，显示重置密码引导页】
    showFindPasswordDialog: function () {
      if (!this.findPswDlg) {
        this.findPswDlg = new FindPsw(parent);
        this.findPswDlg.init();
      }
      parent.showContainer($("#findPassword"));
    },

// 【显示跳槽窗口】
    showChoseOneDialog: function (team) {
      $("#choseOne").find('.teamName').text(team.name);
      $("#goNewTeam").unbind().click(function () {    //进入新团队
        $.ajax({
          url: BASE_URL + joinNewTeam, type: 'POST', data: { teamId: team.id },
          success: function (data) {
            if (data.success) {
              parent.goToSystem();
            } else {
              $('.errorPlace').html("加入新团队失败" + contactUs);
            }
          },
          error: function () {
            $('.errorPlace').html("加入新团队失败" + contactUs);
          }
        });
      });
      $("#stayOldTeam").unbind().click(function () {//不进入新团队
        parent.goToSystem();
      })
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
            $('.errorPlace').html("该用户名已存在");
          }
        },
        error: function () {
          $('.errorPlace').html("用户名有效性验证失败，请重试");
        }
      })
    },

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

// 【初始化社会化登录】
    initOtherAuthLogin: function () {
      var inviteCode = $("#inviteCode").val();
      var params = {
        inviteCode: inviteCode || null,
        uid: uidParam || null,
        reg: regParam || null
      };
      var s = [];
      for (var i in params) {
        s.push(i + '=' + params[i] || '');
      }
      // QQ登录
      var paramStr = "?" + s.join("&");
      $(".sQQ").click(function () {
        window.open(BASE_URL + qqAuth + paramStr);
      });

      // 点QQ登录的图片或文字跳转到QQ登录
      $("#pageSoonLogin").find(".toQQLogin").click(function () {
        window.open(BASE_URL + qqAuth + paramStr);
      });
      //微信
      $(".sWeixin").click(function () {
        window.open(BASE_URL + wxAuth + paramStr);
      });
      $(".sWeibo").click(function () {
        window.open(BASE_URL + sinaAuth + paramStr);
      })
    }
  }
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
        parent.showContainer($('#pageRegLog'));
        parent.loginDialog.showReg();
      });

      //点击登录按钮
      $soonContianer.find(".soonLogBtn").unbind().click(function () {
        if ($("#logBtn").attr('disabled')) {
          $('.errorPlace').html('登录失败，请稍后重试。' + contactUs);
          return;
        }
        var loginCode = $soonContianer.find(".logEmail").val();               // 获取用户邮箱信息
        var pwd = $soonContianer.find(".logPassword").val();                  // 获取登录密码信息
        var notCheck = $.cookie("notPsw");  // 获取是否有记住密码
        self.setCookie(loginCode, pwd, !notCheck);
        self.login();
      });
    },

    /*---------------------事件设置结束----------------------*/

    // 显示QQ的内容
    showQQCont: function () {
      $soonContianer.find('.switcher ul li').removeClass('active');
      $soonContianer.find(".switchQQ").addClass('active');
      $soonContianer.find(".soonCont").hide();
      $soonContianer.find('.QQMain').show();
      $soonContianer.find('.switchBar').css('left', '0');
      $('.errorPlace').html('');
    },

    // 显示微信框的内容
    showWXCont: function () {
      $soonContianer.find('.switcher ul li').removeClass('active');
      $soonContianer.find(".switchWX").addClass('active');
      $soonContianer.find(".soonCont").hide();
      $soonContianer.find('.WXMain').show();
      $soonContianer.find('.switchBar').css('left', '92px');
      $('.errorPlace').html('');
      this.freshWxCont();
    },

    freshWxCont: function(){
      var obj = new WxLogin({
        id:"login_container",
        appid: "wx0cfc58ac923147d2",
        scope: "snsapi_login",
        redirect_uri: "http://beta.rishiqing.com/task/weixinOauth/afterLogin",
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
      $soonContianer.find('.switchBar').css('left', '185px');
      this.getCookie($soonContianer.find(".logEmail"), $soonContianer.find(".logPassword"));
      $soonContianer.find("input:visible:not(:disabled):first").focus(); // 聚焦
      $('.errorPlace').html('');
    },

    // 【密码功能】
    setCookie: function (userEmail, password, notCheck) { //设置cookie
      if (!notCheck) { //判断是否选中了“记住密码”复选框
        $.cookie("userEmail", userEmail, { expires: 90 });//调用jquery.cookie.js中的方法设置cookie中的用户邮箱
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
    },
// 【点登录，发送登录请求】
    login: function () {
      var $loginCode = $soonContianer.find(".logEmail");
      var loginCode = $soonContianer.find(".logEmail").val();
      var $pwd = $soonContianer.find(".logPassword");
      var pwd = $soonContianer.find(".logPassword").val();
      if (!loginCode) {
        $loginCode.focus();
        $('.errorPlace').html("请输入邮箱或手机号");
      } else if (!pwd) {
        $pwd.focus();
        $('.errorPlace').html("请输入密码");
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
              if (nowTeam) { //如果是从邀请进来的，登录的时候需要判断是否加入新团队之类的。
                var orgTeam = data.team;
                if (orgTeam) {//已经存在团队
                  //判断新团队和旧团队是否为同一个团队
                  if (orgTeam.id == nowTeam.id) {//是同一个团队，则直接进入系统
                    parent.goToSystem();
                  } else { // 不是同一个团队，弹出跳槽窗口
                    parent.showContainer($("#choseOne"));
                    parent.loginDialog.showChoseOneDialog(nowTeam);
                  }
                } else {//不存在团队 加入新团队
                  $.ajax({
                    url: BASE_URL + joinNewTeam, type: 'POST', data: { teamId: nowTeam.id },
                    success: function (data) {
                      if (data.success) {
                        parent.goToSystem();
                      } else {
                        alert("操作失败，请重试");
                      }
                    },
                    error: function () {
                      //alert("system error");
                    }
                  })
                }
              } else {
                if (data.notCommonUser) { // 如果不是普通用户(是我们日事清系统管理员)
                  parent.goToSystem(true);
                } else {
                  parent.goToSystem();
                }
              }
            } else {
              if (data.errors && data.errors.message) {
                $('.errorPlace').html(data.errors.message);
              } else {
                $('.errorPlace').html('登录失败！' + contactUs);
              }
            }
          },
          error: function () {
            $('.errorPlace').html('登录失败！' + contactUs);
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
            $('.errorPlace').html("该用户名已存在");
          }
        },
        error: function () {
          $('.errorPlace').html("用户名有效性验证失败，请重试");
        }
      })
    },
  }
}

/*-----------找回密码模块-----------*/
function FindPsw (DlgView) {
  var sendFindPwdEmail = "/reg/sendFindPasswordEmail";
  var restPwd = "/reg/resetPassWord";

  return {
    init: function () {
      this.setEvent();
    },
    setEvent: function () {
      var self = this;
// 【重置模块有这样几个页面：引导页，手机找回，邮箱找回，重置页。】
      //引导页点发送
      $("#send").unbind().click(function () {
        self.clickSend();
      });
    },
//【点击发送按钮】
    clickSend: function () {
      var self = this;
      var findReg = $("#findRegEmail").val();
      if (!findReg) {
        $('.errorPlace').html("请输入邮箱或手机号");
      } else if (emailStr.test(findReg)) {
        self.sendFindPasswordEmail(findReg);
      } else if (phoneStr.test(findReg)) {
        self.showSendMessage(findReg);
      } else {
        $('.errorPlace').html("邮箱或手机格式错误");
      }
    },

    /*----邮件线路----*/
// 【发送邮件】
    sendFindPasswordEmail: function (email) {
      var self = this;
      $.ajax({
        url: BASE_URL + sendFindPwdEmail,
        type: 'POST',
        data: {
          email: email
        },
        success: function (data) {
          if (data.success) { // 成功发送邮件，切换到去邮箱界面
            self.showSendEmail(email);
          } else {
            var errors = data.errors;
            if (errors) { // 邮箱没注册，给提示。
              $('.errorPlace').html(errors[0]);
            }
          }
        },
        error: function () {
          $('.errorPlace').html("邮件发送失败，请稍候重试");
        }
      })
    },

// 【显示发送邮件成功弹窗，可以点击登录邮箱跳到相应邮箱位置】
    showSendEmail: function (email) {
      var sendEmailMsg = $("#sendEmailMsg");
      DlgView.showContainer($("#sendEmail"));
      sendEmailMsg.val(email).attr("disabled", true).addClass('disabled'); // 禁止输入
      // 点 登陆邮箱
      $("#emailResetPsw").unbind().click(function () {
        if (!sendEmailMsg.val()) {
          $('.errorPlace').html("请输入邮箱");
        } else if (!emailStr.test(sendEmailMsg.val())) {
          $('.errorPlace').html("邮箱格式错误");
        } else {
          var flag = false;
          for (var key in emailMap) {
            if (sendEmailMsg.val().endWith(key)) {
              window.open(emailMap[key]);
              flag = true;
            }
          }
          if (flag == false) {
            $('.errorPlace').html("找不到邮箱地址，请手动登录验证！");
          }
        }
      });
    },

    /*----手机线路----*/
// 【点发送，如果是手机号，测试手机是否存在，如果存在，显示‘请输入验证码’界面】
    showSendMessage: function (phoneNum) {
      var self = this;
      $.ajax({
        url: BASE_URL + phoneRegistered, type: 'POST', data: { phoneNumber: phoneNum },
        success: function (data) {
          var result = data.data;
          if (!result.registered) {
            $('.errorPlace').html("该手机号不存在");
          } else {
            loginUtil.sendSmsBtn(phoneNum);
            loginUtil.clearIdentifyInterval();
            self.showCheckYZM(phoneNum);
          }
        },
        error: function () {
          $('.errorPlace').html("手机号验证失败，请重试");
        }
      });
    },

// 手机找回密码，显示 “请输入验证码” 页面
    showCheckYZM: function (phoneNum) {
      var self = this;
      var container = $("#sendMessage"); // 整个弹窗
      var rePhone = $("#reInputPho"); // 电话号码input
      var reSendBtn = $("#phoReSendMessage"); // 重发小圆按钮

      DlgView.showContainer(container);
      rePhone.val(phoneNum).attr("disabled", "disabled").addClass('disabled'); // 电话input字体变灰，不可输入
      loginUtil.interval(reSendBtn, function () { // 开始倒计时，结束后让手机框可输入。
        rePhone.attr('disabled', false).removeClass('disabled');
      });
// 事件
// 点击确认按钮
      container.find("#messageCommit").unbind().click(function () {
        var valicode = container.find("#validateCode").val(); //获取验证码信息
        var phone = rePhone.val();
        if (!rePhone.val()) {
          $('.errorPlace').html("请输入手机号码");
        } else if (!phoneStr.test(rePhone.val())) {
          $('.errorPlace').html("手机号码格式错误");
        } else if (!valicode) {
          $('.errorPlace').html("请输入验证码");
        } else {
          // 验证手机号是否和验证码对应
          $.ajax({
            url: BASE_URL + validateSmsWithPhone, type: 'POST', data: { phone: phone, valicode: valicode },
            success: function (data) {
              if (data.success) {
                self.resetPassword(phone);
              } else {
                if (data.msg) {
                  $('.errorPlace').html(data.msg);
                } else {
                  $('.errorPlace').html("验证失败，请重试");
                }
              }
            },
            error: function () {
              $('.errorPlace').html("验证失败，请重试");
            }
          })
        }
      });

// 点击重发按钮
      container.find(".reSend").unbind().click(function () {
        if (!reSendBtn.hasClass('reading')) {
          if (!rePhone.val()) {
            $('.errorPlace').html("请输入手机号码");
          } else if (!phoneStr.test(rePhone.val())) {
            $('.errorPlace').html("手机号码格式错误");
          } else {
            $.ajax({
              // 验证手机是否存在
              url: BASE_URL + phoneRegistered, type: 'POST', data: { phoneNumber: rePhone.val() },
              success: function (data) {
                var result = data.data;
                if (!result.registered) {
                  $('.errorPlace').html("该手机号不存在");
                } else {
                  loginUtil.sendSmsBtn(rePhone.val());
                  loginUtil.clearIdentifyInterval();
                  loginUtil.interval(reSendBtn, function () {
                    rePhone.attr('disabled', '').removeClass('disabled');
                  });
                }
              }
            });
            rePhone.attr("disabled", "disabled").addClass('disabled');
          }
        }
      });
    },

// 【显示重置密码框】
    resetPassword: function (phone) {
      var container = $("#resetPassword");
      $("#renamePswCommit").unbind().click(function () {
        var $newPassword = $("#newPassword");
        var newPassword = $newPassword.val();
        var $commitPassword = $("#commitPassword");
        var commitPassword = $commitPassword.val();
        if (!newPassword) {
          $newPassword.focus();
          $('.errorPlace').html("请输入密码");
        } else if (newPassword.length < 6) {
          $newPassword.focus();
          $('.errorPlace').html("密码不能小于6位");
        } else if (!commitPassword) {
          $commitPassword.focus();
          $('.errorPlace').html("请再次输入密码");
        } else if (newPassword != commitPassword) {
          $commitPassword.focus();
          $('.errorPlace').html("两次密码输入不一致");
        } else {
          // 给手机号和密码，求验证通过
          $.ajax({
            url: BASE_URL + restPwd,
            type: 'POST',
            data: {
              phone: phone,
              password: newPassword
            },
            success: function (data) {
              if (data.success) {
                DlgView.goToSystem();
              } else {
                if (data.msg) {
                  $('.errorPlace').html(data.msg);
                } else {
                  $('.errorPlace').html("请重试");
                }
              }
            },
            error: function () {
              $('.errorPlace').html("密码修改失败" + contactUs);
            }
          });
        }
      });
      DlgView.showContainer(container);
    }
  }
}

/*-----------公共方法--------------*/
function LoginUtils () {
  var pidMap = [];
  var readNum = 60;
  return {
// 【发送验证码，如果失败显示错误信息】
    sendSmsBtn: function (phone) {
      /**
       * 伪造的mac地址
       * @type {string}
       */
      var visualMacCode = "qc:qc:qc:qc";
      var sendCellphoneCode = "/reg/sendCellphoneValidataCode";
      $.ajax({
        url: BASE_URL + sendCellphoneCode, type: 'POST', data: { phone: phone, phoneMac: visualMacCode },
        success: function (data) {
          if (!data.success) {
            if (data.errors) {
              $('.errorPlace').html(data.errors);
            } else {
              $('.errorPlace').html("发送失败，请稍候重试.");
            }
          } else {
            $('.errorPlace').html("验证码发送成功");
            setTimeout(function () {
              $('.errorPlace').html("");
            }, 2000);
          }
        },
        error: function () {
          $('.errorPlace').html("验证码发送失败,请稍候重试");
        }
      })
    },

// 【定时器】
    interval: function (reSendBtn, onTimeUp) {
      var second = readNum;
      reSendBtn.addClass('reading').html(readNum);
      var pId = setInterval(function () {
        second--;
        reSendBtn.html(second);
        if (second <= 0) {
          reSendBtn.html("重发").removeClass('reading');
          clearInterval(pId);
          onTimeUp();
        }
      }, 1000);
      pidMap.push(pId);
    },

// 【清除计时器进程】
    clearIdentifyInterval: function () {
      pidMap.forEach(function (one) {
        clearInterval(one);
      });
    }
  }
}
