//app.js
App({
    onLaunch: function () {
        this.globalData = {
            userinfo: {
                avatarUrl: '',
                nickName: '',
                isAuthed: false
            },
            userOriginCode: '',
            userOpenId: ''
        }
        wx.login({
            success: (result) => {
                this.globalData.userOriginCode = result.code;
                wx.request({
                    url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx7704a9323416a1d7&secret=17cc1ce61bec993912a61cb401855907&js_code=' + this.globalData.userOriginCode + '&grant_type=authorization_code',
                    success: (res) => {
                        this.globalData.userOpenId = res.data.openid
                        console.log("this.globalData.userOpenId", this.globalData.userOpenId);
                    }
                })
                wx.getSetting({
                    success: (res) => {
                        if (res.authSetting['scope.userInfo']) {
                            //获取用户信息
                            wx.getUserInfo({
                                success: (result) => {
                                    //赋值全局变量
                                    this.globalData.userinfo = result.userInfo;
                                },
                            })
                        }
                    }
                })

            }
        })

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                // env: 'my-env-id',
                traceUser: true,
            })
        }


        const updateManager = wx.getUpdateManager()

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })

        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
                title: '更新提示',
                content: '新版本下载失败',
                showCancel: false
            })
        })
    },

})