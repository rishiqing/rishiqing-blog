/**
 * Created by zjy on 2015/5/6.
 */

$(function(){
    window.regParam = $("#regParam").val();
    window.uidParam = $("#uidParam").val();

    var _loginObj = new Login();

    if(regParam&&uidParam){
        _loginObj.showRegDialog();
    }
    /**
     * 点击或登录
     */
    $(".loginDialog").click(function  () {
            _loginObj.getLoginInstance();
        }
    ),

    _loginObj.initPageStatus();
    /*--------点击交叉号窗口消失-------------*/
    $(".cross").click(function(){
            $(".mask").fadeOut(500);
            $(".popup").fadeOut(500);
            $(".options").hide();
            $(".selectList").show();
            $(this).parent().find(".errorMsg").hide();
        }
    )

    _loginObj.initOtherAuthLogin();
    // $('.login').click();

})



var Login =function(){

    // var BASE_URL = "/task";
    var APP_URL = '/app';
    var SYSTEM_MANAGER = '/systemManage'
    window.queryValue = '';
    // var BASE_URL = "https://www.rishiqing.com/task";
    var BASE_URL = "http://localhost:2369/task";

    var AUTH_ACTION  = "/login/authAjax";

    var SPRING_CHECK = "/j_spring_security_check";

    var INVITE_CODE_CHECK = "/reg/ajaxInvite";

    var joinNewTeam = "/team/joinNewTeam";

    var wxAuth = "/weixinOauth/toLogin";

    var qqAuth = "/qqOauth/toLogin";

    var sinaAuth ="/sinaOauth/toLogin";

    var loginDialog = new LoginDialog();

    return{
        /*
        *初始化社会化登录
         */
        initOtherAuthLogin : function(){
            var inviteCode = $("#inviteCode").val();
            var params ={
                inviteCode:inviteCode||null,
                uid:uidParam||null,
                reg:regParam||null
            }
            var  s = []
            for (var i in params) {
                s.push(i + '=' + params[i] || '');
            }
            var paramStr = "?"+s.join("&")
            //微信
            $(".sWeixin").click(function(){
                window.open(BASE_URL+wxAuth+paramStr);
            })
            $(".sQQ").click(function(){
                window.open(BASE_URL+qqAuth+paramStr);
            })
            $(".sWeibo").click(function(){
                window.open(BASE_URL+sinaAuth+paramStr);
            })
        },
        showNotLoginHead : function(){
            $(".loginHead").hide();
            $(".notLoginHead").show();
        },
        showLoginHead : function(){
            $(".notLoginHead").hide();
            $(".loginHead").show();
        },
        /**
         * 判断是否需要直接进入工作台
         *
         * 如果已经登录，没有收到邀请，则直接进入工作台
         *
         * 如果已登录，收到邀请，则弹出是否更换公司窗口
         *
         * 如果未登录，没有收到邀请，则页面无操作
         *
         * 如果未登录，收到邀请，则自动弹出邀请进入公司窗口
         *
         */
        initPageStatus : function(){
            var self  = this;
            //是否直接跳转到工作台
            var  REDIRECT = false;
            //邀请码
            var inviteCode = $("#inviteCode").val();
            //判断用户是否已经登录
            $.ajax({
                url:BASE_URL+AUTH_ACTION,
                type: 'POST',
                success : function(data){
                    if(data.success){ //已登录
                        if(data.notCommonUser){//如果不是普通用户
                            self.goToSystem(true);
                            return;
                        }
                        self.showLoginHead();
                        window.USER_INFO = data;
                        //判断是否有邀请码
                        if(inviteCode !=""){ //存在邀请码参数
                            //查询邀请码对应的公司是否存在
                            $.ajax({url:BASE_URL+INVITE_CODE_CHECK,type: 'POST',data:{inviteCode:inviteCode},
                                success : function(data){
                                    if(data.success){ //邀请码正确
                                        var team = data;
                                        //判断用户是否已经有团队
                                        if(window.USER_INFO.teamId != null){//已经有团队了
                                            //判断inviteCode是否和与用户现有公司是同一个公司
                                            if( window.USER_INFO.teamId != team.id){
                                                //弹出是否加入新团队
                                                loginDialog.showChoseOneDialog(team);
                                            }else{
                                                self.goToSystem();
                                            }
                                        }else{//没有团队
                                            //直接进入新团队，并且登录
                                            //self.goToSystem();
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
                                        }
                                        //设置邀请窗口
                                    }else{//邀请码错误
                                        self.goToSystem();//直接进入系统
                                    }
                                },
                                error : function(){
                                    //alert("sysendCellphoneValidataCodestem error");
                                }
                            })
                        }else{//不存在
                            //则直接进入系统
                            self.goToSystem();
                        }
                    }else{//未登录
                        self.showNotLoginHead();
                        if(inviteCode !=""){ //存在邀请码参数
                            //查询邀请码对应的公司是否存在
                            $.ajax({url:BASE_URL+INVITE_CODE_CHECK,type: 'POST',data:{inviteCode:inviteCode},
                                success : function(data){
                                    if(data.success){ //邀请码正确
                                        var team = data;
                                        loginDialog.showInvitedPeopleDialog(team);
                                        //设置邀请窗口
                                    }else{//邀请码错误
                                        //无操作
                                    }
                                },
                                error : function(){
                                    //alert("system error");
                                }
                            })
                            //弹出邀请窗口
                            //self.showInviteRegDialog();
                        }else{//不存在
                           //页面不进行操作
                        }
                    }
                },
                error : function(){
                    console.log("initPageStatus login check error")
                    //alert("initPageStatus login check error");
                }

            })
        },
        showRegDialog : function(){
            loginDialog.getRegDialog()
        },
        /**
         * 登录按钮入口
         * 判断是否需要显示登录界面
         */
        getLoginInstance : function(){
            this.getAuth();
        },

        /**
         * 判断是否已登录
         *
         */
        getAuth : function(){
            var self  = this;
            $.ajax({
                url:BASE_URL+AUTH_ACTION,
                type: 'POST',
                success : function(data){
                    if(data.success){
                        self.goToSystem();//已登录则进入系统
                    }else{
                        loginDialog.showLoginDialog();//未登录则显示登录窗口
                    }
                },
                error : function(err){
                  loginDialog.showLoginDialog();
                  // console.info('登录失败了啊。。。。。。。')
                  // console.log('error', err);
                    //alert("system error");
                }

            })
        },

        goToSystem: function(flag){
            if (flag) {
                window.location.href = BASE_URL + SYSTEM_MANAGER;
            } else {
                window.location.href = APP_URL + window.queryValue;
            }
        }
    }

};
