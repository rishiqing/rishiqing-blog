/**
 * Created by zjy on 2015/5/7.
 * Changed by shejuly on 2015/5
 * Changed by maowenqiang 2015/11/26
 *     增加了google统计，以ga()的方式添加对网站事件的监控
 */
$(function() {
    var _$pageLogin=$("#pageLogin");
    var _$pageRegister=$("#pageRegister");
    var _$invitedReg=$("#invitedReg");
    var _$invitedLogin=$("#invitedLogin");
    var loginDialog = new LoginDialog();
    var isEmailClick = false;

    //window.BASE_URL = "/task";

    String.prototype.endWith = function (str) {
        if (str == null || str == "" || this.length == 0 || str.length > this.length)
            return false;
        if (this.substring(this.length - str.length) == str)
            return true;
        else
            return false;
        return true;
    };
    function reg(){loginDialog.getRegDialog();}
    $(".regDialog").click(reg);
    $(".first_btn").click(reg);
    $(".last_btn").click(reg);
/*    $(".loginDialog").click(function () {//右上角和页面中间登陆按钮
        loginDialog.getLoginDialog();
    });*/
    _$pageLogin.find(".switcherReg").click(function () {//登录窗口里的注册切换按钮
        loginDialog.getRegDialog();
    });
    _$pageRegister.find(".switcherLogin").click(function () {//注册窗口里的登陆切换按钮
        loginDialog.getLoginDialog();
    });
/*    _$invitedReg.find(".switcherLogin").click(function () {//被邀请注册里的登陆切换按钮
        loginDialog.showInvitedLoginDialog();
    });*/
/*    _$invitedLogin.find(".switcherReg").click(function () {//被邀请登陆里的注册切换按钮
        loginDialog.showInvitedRegDialog();
    });*/
    $(".findPassword").click(function(){//忘记密码按钮
        loginDialog.showFindPasswordDialog();
    });

    var liIndex;

 /*------以下是注册界面下拉选择框的select功能重写-------------------*/
    var _$liObj = $(".options li");

//显示下拉框
    $(".selectList").click(function(){
        $(".options").show();
        liIndex=0;
        _$liObj.eq(liIndex).siblings().css("background","none");
        _$liObj.eq(liIndex).css("background-color","#eeeeee");
    });

//选择一个选项之后，下拉框消失
    _$liObj.click(function(){
        var selectList=$(".selectList");
        var text   = $(this).text();
        var dValue=selectList.attr("data-value");
        dValue=$(this).val();
        selectList.empty();
        selectList.html(text);
        $(".options").hide();
        selectList.show();
    });

//鼠标移过的背景变色
    _$liObj.hover(function(){
        $(this).siblings().css("background","none");
        $(this).css("background-color","#eeeeee");
    });

//下拉菜单打开后键盘上下和回车的反应
    $(window).keydown(function(e){
        if(!_$liObj.is(":hidden")){
            e.stopPropagation();
            e.preventDefault();
            if(e.keyCode==38&&liIndex!=0){
                _$liObj.eq(--liIndex).siblings().css("background","none");
                _$liObj.eq(liIndex).css("background-color","#eeeeee");
            }else if(e.keyCode==40&&liIndex!=5){
                _$liObj.eq(++liIndex).siblings().css("background","none");
                _$liObj.eq(liIndex).css("background-color","#eeeeee");
            }else if(e.keyCode==13){
                _$liObj.eq(liIndex).click();
            }
        }
    });

//点击别的地方消失
    $(window).click(function(event){
        var _obj = $(event.target);
        if(!_obj.hasClass("selectList")){
            $(".options").hide();
            $(".selectList").show();
        }
    });

//ESC消失
    $(window).keydown(function(e){
        if(e.keyCode==27&&!$(".mask").is(":hidden")){
            loginDialog.hideDlg();
        }
    });

//回车登陆
    $(document).keydown(function (e) {
        if (event.keyCode == 13) {
            var focInp = $("input:focus");
            focInp.parent().parent().find("button.blueBtn").click();
        }
    });
    $(".cross").click(function(){
        loginDialog.hideDlg();
    });

//@键出邮箱
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
    var emails=$(".emails");
    $('#passWord').focus(function () {
      emails.prev().hide();
    });
    emails.keyup(function(e){
        var self=$(this);
        var kw = jQuery.trim(self.val());
        var searchResult=self.prev();
        if(kw == ""){
            searchResult.hide();
            return false;
        }
        var index = kw.indexOf("@");
        if(index<0){
            searchResult.hide();
            return false;
        }
        var startStr = kw.substring(0, index);
        if(startStr == ""){
            searchResult.hide();
            return false;
        }
        var endStr = kw.substring(index);
        var reg = /.*[\u4e00-\u9fa5]+.*$/;
        if(reg.test(startStr)){  //邮箱号不能有汉字
            return false;
        }
        var html = "";
        for (var i = 0; i < emai.length; i++) {
            if (emai[i].indexOf(endStr) >= 0) {
                html = html + "<li class='email' onclick='getEmail(this);' onmouseover='highLight(this);'>" + startStr + emai[i] + "</li>"
            }
        }
        if (html != "" && e.keyCode!=38 && e.keyCode!=40 && e.keyCode!=13) {
            searchResult.html(html).show();
        } else if(html=="") {
            searchResult.hide();
        }
    });

//邮箱中按键按下
    emails.keydown(function(e){
        var searchResult=$(this).prev();
        if(!searchResult.is(":hidden")){
            var divObj=searchResult.find("li");
            if(e.keyCode==40) {
                if (!divObj.hasClass("highLight")) {
                    divObj.eq(0).addClass("highLight");
                }else
                {
                    var temp = searchResult.find(".highLight");
                    if(temp.next().html()!=undefined){
                        temp.removeClass("highLight");
                        temp.next().addClass("highLight");
                    }
                }
            }else if(e.keyCode==38&&!divObj.eq(0).hasClass("highLight")){
                var temp2 = searchResult.find(".highLight");
                temp2.removeClass("highLight");
                temp2.prev().addClass("highLight");
            }else if(e.keyCode==13){
                searchResult.find(".highLight").click();
                e.stopPropagation();
                e.preventDefault();
            }
        }
    });
});

function highLight(obj){
    $("li.highLight").removeClass("highLight");
    $(obj).addClass("highLight");
}

function getEmail(obj){
    var theUl=$(obj).parent();
    theUl.next().val($(obj).html());
    theUl.hide();
}
function getService () {
    $('#kf5-support-btn').click();
    $('.errorDialog').hide();
}
/*
大对象
*/
var LoginDialog = function(){
    var joinNewTeam = "/team/joinNewTeam";
    var SPRING_CHECK = "/j_spring_security_check";
    var usernameRegistered = "/reg/usernameRegistered";
    var REG_URL = "/reg/register";
    // var REG = "/reg/register";
    var SYSTEM_MANAGER = '/systemManage'
    var BASE_URL = "/task";
    var APP_URL = '/app';
    // var  BASE_URL = "http://192.168.3.137/task";
    // var  BASE_URL = "http://beta.rishiqing.com/app";
    //var  BASE_URL = "/app";
    var  sendCellphoneCode ="/reg/sendCellphoneValidataCode";
    var  phoneRegistered ="/reg/phoneRegistered";
    var  validateSmsWithPhone = "/reg/validateSmsWithPhone";
    //var  register = "/reg/register";
    var  sendFindPwdEmail = "/reg/sendFindPasswordEmail";
    var  restPwd = "/reg/resetPassWord";
    var  userNameEmail = "@rishiqing.com";
    var readNum = 60;//秒
    var contactUs = ".您还可以<a target='_blank' class='toUs' href='javascript:;' onclick = 'getService();'>在线咨询</a>";
    var _$mask=$(".mask");
    var pidMap =[];
    var emailMap ={
        '@163.com':'http://mail.163.com',
        '@126.com':'http://mail.126.com',
        '@gmail.com':'https://mail.google.com',
        '@qq.com':'https://mail.qq.com',
        '@hotmail.com':'http://www.hotmail.com',
        '@sina.com':'http://mail.sina.com.cn',
        '@sohu.com':'http://mail.sohu.com',
        '@139.com':'http://mail.10086.cn',
        '@tom.com':'http://web.mail.tom.com',
        '@yeah.net':'http://www.yeah.net',
        '@sogou.com':'http://mail.sogou.com',
        '@21cn.com':'http://mail.21cn.com',
        '@yahoo.com':'http://mail.yahoo.com',
        '@aol.com':'http://mail.aol.com'
    };
    var _$pageLogin=$("#pageLogin");
    var _$pageRegister=$("#pageRegister");
    var _$invitedReg=$("#invitedReg");
    var _$invitedLogin=$("#invitedLogin");
    var _$errMsgId=$(".errorMsgId");
    var _$errMsgPsw=$(".errorMsgPsw");
    var _$errMsgMiddle=$(".errorMsgMiddle");
    return{
        usernameRegistered : function(userName,successCallBack){
            var self = this;
            $.ajax({url: BASE_URL + usernameRegistered, type: 'POST', data: {userName: userName},
                success: function (data) {
                    var result = data.data
                    if (!result.registered){//用户名不存在
                        successCallBack.call(self);
                    } else {//用户名已存在
                        self.showErrorMsg(_$errMsgId,"该用户名已存在");
                    }
                },
                error: function () {
                    self.showErrorMsg(_$errMsgMiddle,"用户名有效性验证失败，请重试");
                }
            })
        },
//显示窗口
        showDlg: function(container){
            container.find(".errorMsg").html("");
            container.find(".errorMsg").hide();
            var height = $(document).height();
            var weight = $(document).width();
            _$mask.height(height);
            var windowHeight =  $(window).height();
            var windowWidth  =  $(window).width();
            var top = (windowHeight - container.height())/2;
            var left   = (windowWidth - container.width())/2;
            container.css({top:top,left:left});
            $(".popup").fadeOut(200);
            _$mask.show();
            // container.fadeIn(200);
            container.show();
            container.find("input:not(:disabled):first").focus();
        },

//【隐藏窗口，同时解绑点击事件】
        hideDlg : function(){
            $(".popup").fadeOut(200);
            _$mask.fadeOut(200);
        },


//【错误提示】
        showErrorMsg : function(Contaner,msg){
            $(".errorDialog").css('display','none');
            Contaner.html(msg);
            Contaner.fadeIn(300);
            Contaner.css('display','block');
            Contaner.prev().focus();
        },
        hideErrorMsg:function(){//隐藏错误提示
            $(".errorDialog").css('display','none');
        },
        getRegDialog : function(){//打开注册窗口
            this.showRegDialog();
        },
        getLoginDialog : function(){//打开登录窗口
            this.showLoginDialog();
        },

//【注册】
        showRegDialog : function(){
            var self = this;
            var userFrom  = _$pageRegister.find("#selectList").attr("data-value");
            $(".errorDialog").css('display','none');//隐藏错误信息
            _$pageRegister.find("#regEmail").val(""); //清空用户邮箱信息
            _$pageRegister.find("#selectList").html("您从那种渠道了解我们");//渠道设置成默认值
            userFrom=0;
            _$pageRegister.find("#regPassword").val("");//清空密码信息
            var emailStr= /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;//邮箱验证
            var phoNumStr= /^1[3|4|5|8][0-9]\d{8}$/;//手机号验证
            _$pageRegister.find("#regBtn").unbind().click(function(){

                ga('send','event','login','click','对话框注册',1);

                var username = _$pageRegister.find("#regEmail").val(); //获取用户邮箱信息
                var password =_$pageRegister.find("#regPassword").val();//获取密码信息
                if(!username){
                    self.showErrorMsg(_$errMsgId,"请输入邮箱或手机号");
                }/*else if(!emailStr.test(username)&&!phoNumStr.test(username)){
                    self.showErrorMsg(_$errMsgId,"邮箱或手机号格式错误");
                }*/
                else if(!password){
                    self.showErrorMsg(_$errMsgPsw,"请输入密码");
                } else if(password.length<6){
                    self.showErrorMsg(_$errMsgPsw,"密码不能小于6位");
                }
                //else if(!userFrom){
                //    self.showErrorMsg(_$pageRegister,"请选择来源渠道");
                //}
                else if(phoNumStr.test(username)){
                    //判断手机号是否已存在
                    $.ajax({url: BASE_URL + phoneRegistered, type: 'POST', data: {phoneNumber: username},
                        success: function (data) {
                            var result = data.data
                            if (!result.registered){//手机号不存在
                                //发送验证码
                                self.sendSmsBtn(username);
                                self.showPhoneRegDlg(username,password);
                            } else {//手机号已存在
                                self.showErrorMsg(_$errMsgId,"该手机号已存在");
                            }
                        },
                        error: function () {
                            self.showErrorMsg(_$errMsgMiddle,"手机号验证失败，请重试");
                        }
                    })
                 /*   self.showRegSuccessDlg(username);*/
                } else{
                    self.usernameRegistered(username,function(){
                        var data = {username:username,
                            password:password,
                            userFrom:userFrom,
                            createdByClient:"web"};
                        if(regParam)data.reg = regParam;
                        if(uidParam)data.uid = uidParam;
                      console.log('----------------------------------------');
                        $.ajax({
                            url:BASE_URL+REG_URL,
                            data:data,
                            type: 'POST',
                            msg:'注册',
/*
                            headers: {
                              "Access-Control-Allow-Headers":"X-Requested-With"
                            },
*/

                           /*headers: {
                              'X-Requested-With':'XMLHttpRequest'
                            },*/
                            success : function(data){
                                if(data.success){//注册成功
                                    //显示注册成功窗口
                                    self.showRegSuccessDlg(data.data.username);
                                }else{
                                    var errors = data.errors;
                                    var error = data.error;
                                    if(errors){
                                        self.showErrorMsg(_$errMsgId,errors);
                                    }else if(error){
                                        self.showErrorMsg(_$errMsgId,error);
                                    }else{
                                        self.showErrorMsg(_$errMsgMiddle,"注册失败，请再次尝试"+contactUs);
                                    }
                                }
                            },
                            error : function(){
                                self.showErrorMsg(_$errMsgMiddle,"注册失败，请再次尝试"+contactUs);
                            }
                        })
                    })
                }
            });
            self.showDlg(_$pageRegister);
        },
        /**
         * 发送验证码
         * AJAX 请求后台
         */
        sendSmsBtn : function(phone){
            var self = this;
            /**
             * 伪造的mac地址
             * @type {string}
             */
            var visualMacCode = "qc:qc:qc:qc";
            $.ajax({url: BASE_URL + sendCellphoneCode, type: 'POST', data: {phone: phone,phoneMac:visualMacCode},
                success: function (data) {
                    if (data.success) {

                        // regPage.showErrorMsg("成功");
                        /*self.showErrorMsg(_$errMsgId,"请输入邮箱或手机号");*/
                    } else if(data.errors){
                        self.showErrorMsg(_$errMsgId, data.errors);
                    } else{
                        self.showErrorMsg(_$errMsgId, "发送失败，请稍候重试.");
                    }
                },
                error: function () {
                    self.showErrorMsg(_$errMsgMiddle,"验证码发送失败,请稍候重试");
                    // alert("system error");
                }
            })
        },
//【登录】
        showLoginDialog:function(){
            var userEmail=$("#userEmail");
            var passWord=$("#passWord");
            var self  = this;
            $(".errorDialog").css('display','none');//隐藏错误信息
            self.getCookie(userEmail,passWord);   //用户的登录界面,getcookie;
            _$pageLogin.find("#newLogin").unbind().click(function(){//点击登录按钮

                ga('send','event','login','click','对话框登录',1);

                var loginCode = $("#userEmail").val(); //获取用户邮箱信息
                var pwd = $("#passWord").val(); //获取登陆密码信息
                var checked = $("[name='checkboxLogin']:checked");//获取“是否记住密码”复选框  */
                self.setCookie(loginCode,pwd,checked);
                self.login();
            });
            self.showDlg(_$pageLogin);
        },

//【发送登录请求】
        login : function(){
            var self = this;
            var loginCode = $("#userEmail").val(); //获取用户邮箱/手机信息
            var pwd = $("#passWord").val(); //获取登陆密码信息
            //var emailStr= /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;//邮箱验证
            //var phoNumStr= /^1[3|4|5|8][0-9]\d{8}$/;//手机号验证
            if(!loginCode){
                self.showErrorMsg(_$errMsgId,"请输入邮箱或手机号");
            }/*else if(!emailStr.test(loginCode)&&!phoNumStr.test(loginCode)){
                self.showErrorMsg(_$errMsgId,"邮箱或手机号码格式错误");
            }*/
            else if(!pwd){
                self.showErrorMsg(_$errMsgPsw,"请输入密码");
            }else{
                // self.showErrorMsg(_$errMsgMiddle, contactUs);
                $.ajax({
                    url:BASE_URL+SPRING_CHECK,
                    data:{
                        j_username:loginCode,
                        j_password:pwd,
                        _spring_security_remember_me:true
                    },
                    type: 'POST',
                    /*headers: {
                      'X-Requested-With':'XMLHttpRequest'
                    },*/
                    success : function(data){
                        //登录成功
                        if(data.success){
                            if(data.notCommonUser){//如果不是普通用户
                                self.goToSystem(true);
                                return;
                            } else {
                                self.goToSystem();
                            }
                        }else{
                            console.log('im error data = %o', data);
                          /*  alert(JSON.stringify(data))*/
                            if(data.errors&&data.errors.message){
                                self.showErrorMsg(_$errMsgMiddle,data.errors.message+contactUs);
                            }else{
                                self.goToSystem();
                            }
                        }
                    },
                    error : function(){
                        self.showErrorMsg(_$errMsgMiddle,"登录失败，请重试");
                      /*
                       * 测试所用， 需要删除
                       * */
                        // self.goToSystem();

                    }
                })
            }
        },

//【跳槽】
        showChoseOneDialog : function(team){
            var self = this;
            self.showDlg($("#choseOne"));
            $("#choseOne #teamName").text(team.name);
            $("#goNewTeam").unbind().click(function(){    //进入新团队

                ga('send','event','login','click','对话框跳槽进入新团队',1);

                //判断inviteCode是否和与用户现有公司是同一个公司
                    $.ajax({url: BASE_URL + joinNewTeam, type: 'POST', data: {teamId: team.id},
                        success: function (data) {
                            if (data.success) {
                                self.goToSystem();
                            } else {
                                alert("操作失败，请重试");
                           }
                        },
                        error: function () {
                           // alert("system error");
                        }
                    })
                self.hideDlg();
            });
            $("#stayOldTeam").unbind().click(function(){//不进入新团队
                self.hideDlg();
                self.goToSystem();
            })
        },

//【邀请引导页】
        showInvitedPeopleDialog:function(team){
            var invitedPeople=$("#invitedPeople");
            //var teamName = team.name;
            var self = this;
            invitedPeople.find("#inviteLogin1").unbind().click(function(){//已有账户，登录

                // ga('send','event','login','click','对话框邀请登录',1);

                self.showInvitedLoginDialog(team);
            });
            invitedPeople.find("#inviteReg1").unbind().click(function(){//立即注册新账户

                // ga('send','event','login','click','对话框邀请注册',1);

                self.showInvitedRegDialog(team);
            });
            invitedPeople.find("#teamName").text(team.name);
            self.showDlg(invitedPeople);
        },

//【邀请注册】
        showInvitedRegDialog : function(team){
            var self = this;
            //var teamName = team.name;
            $(".errorDialog").css('display','none');//隐藏错误信息
            _$pageRegister.find("#email").val(""); //清空用户邮箱/电话信息
            //$("#pageRegister #regName").val(""); //清空名字信息
            _$pageRegister.find("#password").val("");//清空密码信息
            var emailStr= /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;//邮箱验证
            var phoNumStr= /^1[3|4|5|8][0-9]\d{8}$/;//手机号验证
            _$invitedReg.find("#teamName").text(team.name);
            _$invitedReg.find(".switcherLogin").unbind().click(function(){
                self.showInvitedLoginDialog(team);
            })
            _$invitedReg.find("#invitedRegBtn").unbind().click(function(){

                ga('send','event','login','click','对话框邀请注册',1);

                var username = _$invitedReg.find("#email").val();
                var password = _$invitedReg.find("#password").val();
                if(!username){
                    self.showErrorMsg( _$errMsgId,"请输入邮箱");
                }/*else if(!emailStr.test(username)&&!phoNumStr.test(username)){
                    self.showErrorMsg(_$errMsgId,"邮箱或电话号码格式错误");
                }*/else if(!password){
                    self.showErrorMsg( _$errMsgPsw,"请输入密码");
                }else if(password.length<6){
                    self.showErrorMsg(_$errMsgPsw,"密码不能小于6位");
                }else if(phoNumStr.test(username)){
                    //判断手机号是否已存在
                    $.ajax({url: BASE_URL + phoneRegistered, type: 'POST', data: {phoneNumber: username},
                        success: function (data) {
                            var result = data.data
                            if (!result.registered){//手机号不存在
                                //发送验证码
                                self.sendSmsBtn(username);
                                self.showPhoneRegDlg(username,password,team);
                            } else {//手机号已存在
                                self.showErrorMsg(_$errMsgId,"该手机号已存在");
                            }
                        },
                        error: function () {
                            self.showErrorMsg(_$errMsgMiddle,"手机号验证失败，请重试");
                        }
                    })
                    //self.showPhoneRegDlg(username,username);
                }else{
                    self.usernameRegistered(username,function(){
                        var data = {
                            username:username,
                            password:password,
                            userFrom:3,//默认同事邀请
                            t:team.joinToken
                        };
                        if(regParam)data.reg = regParam;
                        if(uidParam)data.uid = uidParam
                        $.ajax({
                            url:BASE_URL+REG_URL,
                            data:data,
                            type: 'POST',
                            headers: {
                              "Access-Control-Allow-Headers":"X-Requested-With"/*,
                              'X-Requested-With': 'XMLHttpRequest'
                             */},
                            success : function(data){
                                if(data.success){//注册成功，跳到登陆窗口
                                    self.showRegSuccessDlg(data.data.username,data.data.username);
                                }else{
                                    var errors = data.errors;
                                    var error = data.error;
                                    if(errors){
                                        self.showErrorMsg(_$errMsgMiddle,errors);
                                    }else if(error){
                                        self.showErrorMsg(_$errMsgMiddle,error);
                                    }else{
                                        self.showErrorMsg(_$errMsgMiddle,"注册失败，请再次尝试"+contactUs);
                                    }
                                }
                            },
                            error : function(){
                                self.showErrorMsg(_$errMsgMiddle,"注册失败，请再次尝试"+contactUs);
                            }
                        })
                    })
                    //self.showRegSuccessDlg(username);
                }
            });
            self.showDlg(_$invitedReg);
        },

//【邀请登陆】
        showInvitedLoginDialog : function(team){
            var inviteEmail=$("#inviteEmail");
            var invitePassword=$("#invitePassword");
            var self = this;
            //var teamName = team.name;
            $(".errorDialog").css('display','none');//隐藏错误信息
            var errorMsgId=_$invitedLogin.find(_$errMsgId);
            var errorMsgPsw=_$invitedLogin.find(_$errMsgPsw);
            this.getCookie2(inviteEmail,invitePassword);//接受团队邀请之后的登录界面，getcookie;


            _$invitedLogin.find(".switcherReg").unbind().click(function(){
                self.showInvitedRegDialog(team);
            })
            _$invitedLogin.find("#inviteLogin").unbind().click(function(){

                ga('send','event','login','click','对话框邀请登录',1);

                //登录
                var loginCode = _$invitedLogin.find("#inviteEmail").val(); //获取用户邮箱信息
                var pwd = _$invitedLogin.find("#invitePassword").val(); //获取登陆密码信息
                var checked = _$invitedLogin.find("[name='checkboxInvite']:checked");//获取“是否记住密码”复选框  */
                self.setCookie(loginCode,pwd,checked);
                if(!loginCode){
                    self.showErrorMsg(errorMsgId,"请输入用户名");
                }else if(!pwd){
                    self.showErrorMsg(errorMsgPsw,"请输入密码");
                }else{
                    $.ajax({
                        url:BASE_URL+SPRING_CHECK,
                        data:{
                            j_username:loginCode,
                            j_password:pwd
                        },
                        type: 'POST',
                        success : function(data){
                           //登录成功
                            if(data.success){
                                var orgTeam = data.team;
                                if(orgTeam){//已经存在团队
                                    //判断新团队和旧团队是否为同一个团队
                                    if(orgTeam.id == team.id){//是同一个团队，则直接进入系统
                                        self.goToSystem();
                                    }else{//不是同一个团队，弹出团队选择窗口
                                        self.showChoseOneDialog(team);
                                    }
                                }else{//不存在团队//加入新团队
                                    $.ajax({url: BASE_URL + joinNewTeam, type: 'POST', data: {teamId: team.id},
                                        success: function (data) {
                                            if (data.success) {
                                                self.goToSystem();
                                            } else {
                                                alert("操作失败，请重试");
                                            }
                                        },
                                        error: function () {
                                            //alert("system error");
                                        }
                                    })
                                }
                                //self.goToSystem();
                                //判断是否存在团队
                            }else{
                                //var errors = data.errors.message;
                                if(data.errors&&data.errors.message){
                                    self.showErrorMsg(_$errMsgMiddle,data.errors.message);
                                }else{
                                   self.showErrorMsg(_$errMsgMiddle,"登录失败，请重试");
                                }

                            }
                        },
                        error : function(){
                            //alert("system error");
                        }
                    });
                }
            });
            _$invitedLogin.find("#teamName").text(team.name);
            self.showDlg(_$invitedLogin);
        },

//【手机注册发验证码】
        showPhoneRegDlg: function(phoNum,password,team){
            var self = this;
            var _$phoneReg=$("#phoneReg");//整个弹窗
            var rePhone=$("#regReInputPho");//电话号码input
            var reSendBtn = $("#regReSendMessage");//重发小圆按钮
            var phoneStr = /^1[3|4|5|8][0-9]\d{8}$/;//手机验证 /^1[3,5]\d{9}$/
            rePhone.attr("disabled","disabled");//禁止输入
            rePhone.val(phoNum);//电话input设置成刚输入的电话号
            rePhone.css("color","#ccc");//电话input灰色底
            $(".errorDialog").css('display', 'none');//隐藏错误信息
            _$phoneReg.find("#regValidateCode").val(""); //清空验证码信息
            _$phoneReg.find("#regMessageCommit").unbind().click(function(){//当确认按钮点击时
                var validateCode = _$phoneReg.find("#regValidateCode").val(); //获取验证码信息
                if(!rePhone.val()){
                    self.showErrorMsg(_$errMsgId,"请输入邮箱或手机号");
                }/*else if (!phoneStr.test(rePhone.val())) {
                    self.showErrorMsg(_$errMsgId, "手机号码格式错误");
                }*/else  if(!validateCode){
                    self.showErrorMsg(_$errMsgPsw, "请输入验证码");
                }else{
                    //经过ajax验证，如果验证码不正确，self.showErrorMsg(_$errMsgPsw, "验证码错误");如果正确：
                    var phone =$("#regReInputPho").val();
                    self.validateSmsWithPhone(phone,validateCode,password,team);
                }
            });
            _$phoneReg.find(".reSend").unbind().click(function(){
                if(reSendBtn.html()=="重发") {
                    if(!phoneStr.test(rePhone.val())){
                        self.showErrorMsg(_$errMsgId, "手机号码格式错误");
                    }else{
                        var phoneNum = rePhone.val()
                        $.ajax({url: BASE_URL + phoneRegistered, type: 'POST', data: {phoneNumber: phoneNum},
                            success: function (data) {
                                var result = data.data
                                if (!result.registered){//手机号不存在
                                    //发送验证码
                                    self.sendSmsBtn(phoneNum);
                                } else {//手机号已存在
                                    self.showErrorMsg(_$errMsgId,"该手机号已存在");
                                }
                            },
                            error: function () {
                                self.showErrorMsg(_$errMsgMiddle,"手机号验证失败，请重试");
                            }
                        })
                        self.interval(reSendBtn,_$phoneReg);
                        self.hideErrorMsg();
                        rePhone.attr("disabled","disabled").css("color","#ddd");
                    }
                }
            });
            self.interval(reSendBtn,_$phoneReg);
            self.showDlg(_$phoneReg);
        },

        validateSmsWithPhone : function(phone,valicode,password,team){
            var self = this
            //开始验证信息
            $.ajax({url: BASE_URL + validateSmsWithPhone, type: 'POST', data: {phone: phone,valicode:valicode},
                success: function (data) {
                    if (data.success) {
                        //regPage.showErrorMsg("验证成功");
                        //验证成功则开始注册
                        var data = {
                            username:phone+userNameEmail,
                            realName:'rishiqing',
                            password:password,
                            phoneNumber:phone,
                            client:"webByPhone"
                        }
                        if(regParam)data.reg = regParam;
                        if(uidParam)data.uid = uidParam
                        if(team){
                            data.t = team.joinToken
                        }
                        $.ajax({url: BASE_URL + REG_URL, type: 'POST',
                            data:data,
                            success: function (data) {
                                if (data.success) {
                                    //进入系统
                                    location.href = BASE_URL;
                                } else {
                                    var errors = data.errors;
                                    if(errors){
                                        self.showErrorMsg(_$errMsgPsw, errors);
                                    }
                                }
                            },
                            error: function () {
                                self.showErrorMsg(_$errMsgPsw, "注册失败，请稍候重试");
                            }
                        })
                    } else {

                        var msg = data.msg;
                        if(msg){
                            self.showErrorMsg(_$errMsgMiddle, msg);
                        }else{
                            self.showErrorMsg(_$errMsgMiddle, "注册失败，请稍候重试");
                        }

                    }
                },
                error: function () {
                    self.showErrorMsg(_$errMsgMiddle, "验证失败，请重试");
                }
            })
        },

//【邮箱注册要去验证】
        showRegSuccessDlg : function(checkEmail){
            var self = this;
            var regSuccessDlg=$("#regSuccessDlg");//整个框
            var reSendBtn = $("#regReSendMessage2");//重发小圆按钮
            var emailStr= /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;//邮箱验证
            var cheEmail=$("#checkEmail");//Email框
            cheEmail.css("color","#ccc");//邮箱input灰色底
            cheEmail.val(checkEmail);//设置邮箱值
            cheEmail.attr("disabled","disabled");//禁止输入
            $(".errorDialog").css('display', 'none');//隐藏错误信息
            /*regSuccessDlg.find("#toCheckEmail").unbind().click(function(){
                    for(var key in emailMap){
                        if(username.endWith(key)){
                              //window.location.href = emailMap[key];
                            window.open(emailMap[key]);
                        }
                        emailMap[key].endWith(username)
                    }
            });*/
            regSuccessDlg.find("#toCheckEmail").unbind().click(function(){
                if (!emailStr.test(cheEmail.val())) {
                    self.showErrorMsg(_$errMsgId, "邮箱格式错误");
                }else{
                    var flag=false;
                    for(var key in emailMap){
                        if(cheEmail.val().endWith(key)){
                            window.open(emailMap[key]);
                            flag=true;
                        }
                        //emailMap[key].endWith(cheEmail.val());
                    }
                    if(flag==false){
                        self.showErrorMsg(_$errMsgId, "找不到邮箱地址，请手动登陆验证！");
                    }
                }
            });
            self.showDlg(regSuccessDlg);
        },

//【进入系统】
        goToSystem: function(flag){
            if (flag) {
                window.location.href = BASE_URL + SYSTEM_MANAGER;
            } else {
                window.location.href = APP_URL + window.queryValue;
            }
        },

//【重置密码引导页】
        showFindPasswordDialog: function () {
            var self = this;
            var container = $("#findPassword");
            var emailStr = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;//邮箱验证
            var phoneStr = /^1[3|4|5|8][0-9]\d{8}$/;//手机验证
            $(".errorDialog").css('display', 'none');//隐藏错误信息
            container.find("#findRegEmail").val(""); //清空用户邮箱或手机号信息
            container.find("#send").unbind().click(function (){
                var findReg = container.find(".popContent").val(); //获取注册时邮箱或手机号信息
                if (!findReg) {
                    self.showErrorMsg(_$errMsgId, "请输入邮箱或手机号");
                } else if (emailStr.test(findReg)) {
                    //显示发送邮件界面
                    self.sendFindPasswordEmail(findReg);
                }else if(phoneStr.test(findReg)){
                    //判断手机号是否已存在
                    $.ajax({url: BASE_URL + phoneRegistered, type: 'POST', data: {phoneNumber: findReg},
                        success: function (data) {
                            var result = data.data
                            if (!result.registered){//手机号不存在
                                self.showErrorMsg(_$errMsgId,"该手机号不存在");
                            } else {//手机号存在
                                self.sendSmsBtn(findReg);
                                //显示发送短信界面
                                self.clearIdentifyInterval();
                                self.showSendMessage(findReg)
                            }
                        },
                        error: function () {
                            self.showErrorMsg(_$errMsgMiddle,"手机号验证失败，请重试");
                        }
                    })
                }else{
                    self.showErrorMsg(_$errMsgId, "邮箱或手机格式错误");
                }
            });
            self.showDlg(container);
        },
        /**
         * 发送找回密码邮件
         */
        sendFindPasswordEmail : function(email){
            var self = this;
            $.ajax({url: BASE_URL + sendFindPwdEmail, type: 'POST',
                data:{
                    email:email
                },
                success: function (data) {
                    if (data.success) {
                        self.clearIdentifyInterval();
                        self.showSendEmail(email);
                    } else {
                        var errors = data.errors;
                        if(errors){
                            self.showErrorMsg(_$errMsgId, errors[0]);
                        }
                    }
                },
                error: function () {
                    self.showErrorMsg(_$errMsgPsw, "邮件发送失败，请稍候重试");
                }
            })
        },
//【发邮件重置密码】
        showSendEmail:function(email){
            var self = this;
            var container = $("#sendEmail");
            var reSend = $("#reSendEmail");
            var sendEmailMsg=$("#sendEmailMsg");
            sendEmailMsg.val(email);
            $(".errorDialog").css('display', 'none');//隐藏错误信息
            var emailStr = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;//邮箱验证
            sendEmailMsg.css("color","#ddd");//邮箱input字变灰
            sendEmailMsg.attr("disabled","disabled");//禁止输入
            //container.find(".reSend").unbind().click(function(){
            //    if(reSend.html()=="重发") {
            //        if (!sendEmailMsg.val()) {
            //            self.showErrorMsg(_$errMsgId, "请输入邮箱");
            //        }else if(!emailStr.test( $("#sendEmailMsg").val())){
            //            self.showErrorMsg(_$errMsgId, "邮件格式错误");
            //        }else{
            //            self.interval(reSend,container);
            //            self.hideErrorMsg();
            //            container.find(".searchResult").hide();
            //        }
            //    }
            //});
            container.find("#emailResetPsw").unbind().click(function(){//按钮点击时
                if (!sendEmailMsg.val()) {
                    self.showErrorMsg(_$errMsgId, "请输入邮箱");
                }else if (!emailStr.test(sendEmailMsg.val())) {
                    self.showErrorMsg(_$errMsgId, "邮箱格式错误");
                }else{
                    var flag=false;
                    for(var key in emailMap){
                        if(sendEmailMsg.val().endWith(key)){
                            window.open(emailMap[key]);
                            flag=true;
                        }
                        //emailMap[key].endWith(sendEmailMsg.val());
                    }
                    if(flag==false){
                        self.showErrorMsg(_$errMsgId, "找不到邮箱地址，请手动登陆验证！");
                    }
                }
            });
            //self.interval(reSend,container);
            self.showDlg(container);
        },

//【发短信重置密码】
        showSendMessage:function(phoneNum){
            var self = this;
            var container = $("#sendMessage");//整个弹窗
            var rePhone=$("#reInputPho");//电话号码input
            var reSendBtn = $("#phoReSendMessage");//重发小圆按钮
            var phoneStr = /^1[3|4|5|8][0-9]\d{8}$/;//手机验证
            rePhone.attr("disabled","disabled").css("color","#ddd");//电话input字体变灰，不可输入
            rePhone.val(phoneNum);//电话input设置成刚输入的电话号
            $(".errorDialog").css('display', 'none');//隐藏错误信息
            container.find("#validateCode").val(""); //清空验证码信息

            container.find("#messageCommit").unbind().click(function(){//当确认按钮点击时
                var validateCode = container.find("#validateCode").val(); //获取验证码信息
                if (!phoneStr.test(rePhone.val())) {
                    self.showErrorMsg(_$errMsgId, "手机号码格式错误");
                }else  if(!validateCode){
                    self.showErrorMsg(_$errMsgPsw, "请输入验证码");
                }else{
                    self.validateResetPassword(rePhone.val(),validateCode);
                   // self.resetPassword(rePhone.val());
                }
            });
            container.find(".reSend").unbind().click(function(){//点击重发按钮
                if(reSendBtn.html()=="重发") {
                    if(!phoneStr.test(rePhone.val())){
                        self.showErrorMsg(_$errMsgId, "手机号码格式错误");
                    }else{
                        //判断手机号是否存在
                        $.ajax({url: BASE_URL + phoneRegistered, type: 'POST', data: {phoneNumber: rePhone.val()},
                            success: function (data) {
                                var result = data.data
                                if (!result.registered){//手机号不存在
                                    self.showErrorMsg(_$errMsgId,"该手机号不存在");
                                } else {//手机号存在
                                    self.sendSmsBtn( rePhone.val());
                                    //显示发送短信界面
                                    self.clearIdentifyInterval();
                                }
                            }
                        })
                        self.interval(reSendBtn,container);
                        self.hideErrorMsg();
                        rePhone.attr("disabled","disabled").css("color","#ddd");
                    }
                }
            });
            self.interval(reSendBtn,container);
            self.showDlg(container);
        },
        /**
         * 验证手机重置密码的短信
         */
        validateResetPassword : function(phone,valicode){
            var self = this
            //开始验证信息
            $.ajax({url: BASE_URL + validateSmsWithPhone, type: 'POST', data: {phone: phone,valicode:valicode},
                success: function (data) {
                    if (data.success) {
                        //regPage.showErrorMsg("验证成功");
                        //验证成功则开始注册
                        self.resetPassword(phone);
                    } else {
                        if( data.msg){
                            self.showErrorMsg(_$errMsgMiddle, data.msg);
                        }else{
                            self.showErrorMsg(_$errMsgMiddle, "验证失败，请重试");
                        }
                    }
                },
                error: function () {
                    self.showErrorMsg(_$errMsgMiddle, "验证失败，请重试");
                }
            })
        },
//【清除计时器进程】
        clearIdentifyInterval : function(){
            pidMap.forEach(function(one){
                clearInterval(one);
            });
        },

//【定时器】
        interval:function(reSendBtn,container){
            var second = readNum;
            reSendBtn.css("background-color","#C4C5CA").html(readNum);
            var pId = setInterval(function(){
                second --;
                reSendBtn.html(second);
                if(second <= 0){
                    container.find("input:first").removeAttr("disabled").css("color", "#aaa");
                    reSendBtn.html("重发").css("background-color","#07a5e5");
                    clearInterval(pId);
                }
            }, 1000);
            pidMap.push(pId);
        },

//【重置密码】
        resetPassword:function(phone){
            var self = this;
            var container = $("#resetPassword");
            $(".errorDialog").css('display', 'none');//隐藏错误信息
            container.find("#newPassword").val(""); //清空第一个密码
            container.find("#commitPassword").val(""); //清空第二个密码
            container.find("#renamePswCommit").unbind().click(function () {
                var newPassword = container.find("#newPassword").val();
                var commitPassword = container.find("#commitPassword").val();
                if(!newPassword){
                    self.showErrorMsg(_$errMsgId, "请输入密码");
                }else if(newPassword.length<6){
                    self.showErrorMsg(_$errMsgPsw,"密码不能小于6位");
                }else if(!commitPassword){
                    self.showErrorMsg(_$errMsgPsw, "请再次输入密码");
                }else if(newPassword!=commitPassword){
                    self.showErrorMsg(_$errMsgMiddle, "两次密码输入不一致");
                }else{
                    /*发送请求
                     */
                    self.sendResetPassword(phone,newPassword);
                }
            });
            self.showDlg(container);
        },
        /**
         * 发送找回密码邮件
         */
        sendResetPassword : function(phone,password){
            var self = this;
            $.ajax({url: BASE_URL + restPwd, type: 'POST',
                data:{
                    phone:phone,
                    password:password
                },
                success: function (data) {
                    if (data.success) {
                        window.location.href = BASE_URL;
                    } else {
                        if( data.msg){
                            self.showErrorMsg(_$errMsgMiddle, data.msg);
                        }else{
                            self.showErrorMsg(_$errMsgMiddle, "请重试");
                        }
                    }
                },
                error: function () {
                    self.showErrorMsg(_$errMsgPsw, "邮件发送失败，请稍候重试");
                }
            })
        },
/*------cookie记住密码:功能：勾选“记住密码”，点击登录，保存cookie，下次登录不需输入；
 不勾“记住密码”，点击登录，不保存cookie，下次登录需输入；--------------*/
        setCookie : function(userEmail,password,checked){ //设置cookie
            /*var checked = $("[name='checkbox']:checked")*/
            if(checked && checked.length > 0){ //判断是否选中了“记住密码”复选框
                $.cookie("userEmail",userEmail,{expires:30});//调用jquery.cookie.js中的方法设置cookie中的用户邮箱
                $.cookie("pwd",password,{expires:30});//调用jquery.cookie.js中的方法设置cookie中的登陆密码，并使用base64（jquery.base64.js）进行加密
            }else{
                $.cookie("pwd", '');   //如果没有选，删除这个cookie
            }
        },
        getCookie : function(userEmail,password){ //获取cookie
            var loginCode = $.cookie("userEmail"); //获取cookie中的用户邮箱
            var pwd =  $.cookie("pwd"); //获取cookie中的登陆密码
            if(pwd){//密码存在的话把“记住用户邮箱和密码”复选框勾选住
                $("input[name=checkboxLogin]").attr("checked","true");
            }
            else{
                $("input[name=checkboxLogin]").removeAttr("checked");
            }

            if(loginCode){//用户邮箱存在的话把用户邮箱填充到用户邮箱文本框
                userEmail.val(loginCode);
            }

            if(pwd){//密码存在的话把密码填充到密码文本框
                password.val(pwd);
            }
            else{
                password.val('');

            }
        },
         getCookie2 : function(userEmail,password)
        {
            var loginCode = $.cookie("userEmail"); //获取cookie中的用户邮箱
            var pwd =  $.cookie("pwd"); //获取cookie中的登陆密码
            if(pwd){//密码存在的话把“记住用户邮箱和密码”复选框勾选住
                $("input[name=checkboxInvite]").attr("checked","true");
            }
            if(loginCode){//用户邮箱存在的话把用户邮箱填充到用户邮箱文本框
                userEmail.val(loginCode);
            }
            if(pwd){//密码存在的话把密码填充到密码文本框
                password.val(pwd);
            }
        }
    }
};

// console.log('测试测试测试。fuck!!!fasdfas ');