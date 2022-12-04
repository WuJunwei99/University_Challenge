import Toast from '@vant/weapp/toast/toast';

const app = getApp();

const db = wx.cloud.database()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const userBaseInfoCollection = db.collection('user_base_info')
const suggestInfoCollection = db.collection('suggestInfo')
const com = db.command
const _ = db.command
Page({
    data: {
        showAbout: false,
        showFeedback: false,
        active: 2,
        isAuthed: false,
        suggestInfo: '',
        icon: {
            normal: 'https://img.yzcdn.cn/vant/user-inactive.png',
            active: 'https://img.yzcdn.cn/vant/user-active.png',
        },
        userAvatarUrl: '',
        userNickName: 'Hello，同学！',
        aboutDialogButtons: [{
            text: '确定'
        }],
        feedbackDialogButtons: [{
            text: '取消'
        }, {
            text: '提交'
        }],
        avatarUrl: defaultAvatarUrl,
        theme: wx.getSystemInfoSync().theme,
        nickName: '',
        typeS: false,
    },
    tapAbout(e) {
        this.setData({
            showAbout: false,
        })
    },
    onTapToProfile: function () {
      this.setData({typeS: true})
        // wx.navigateTo({
        //     url: '../profile/profile',
        // })
    },
    tapFeedback(e) {
        const _btn = e.detail.item.text;
        if (_btn == '提交') {
            this.submitSuggest();
            return;
        }
        this.showFeedbackClose();
    },
    onShareAppMessage: function (res) {
        console.log("转发成功")
        app.addUserShareInfo(app.globalData)
        return {
            title: '',
            path: '/pages/mine/mine'
        }
    },

    inputSuggestInfo: function (event) {
        if ((event.detail.suggestInfo) !== '') {
            this.setData({
                suggestInfo: event.detail
            });
            console.log(event);
        }
    },

    submitSuggest: function (event) {
        console.log("submitSuggest", this.data.suggestInfo);
        if (this.data.suggestInfo !== "") {
            var time = new Date();
            suggestInfoCollection.add({
                data: {
                    userOpenId: app.globalData.userOpenId,
                    suggestInfo: this.data.suggestInfo,
                    add_time: time,
                },
                success: res => {
                    Toast.success('反馈成功，感谢您的支持！');
                }
            })
        } else {
            Toast.fail('所填为空！');
        }
        this.showFeedbackClose()
    },

    showAboutPopup() {
        this.setData({
            showAbout: true
        });
    },

    showAboutClose() {
        this.setData({
            showAbout: false
        });
    },

    showFeedbackPopup() {
        this.setData({
            showFeedback: true
        });
    },

    showFeedbackClose() {
        this.setData({
            showFeedback: false,
            suggestInfo: ""
        });
    },

    onReady() {

    },
    onChange(event) {
        this.setData({
            active: event.detail
        });
        // event.detail 的值为当前选中项的索引
        if (event.detail === 0) {
            wx.navigateTo({
                url: '../home/home',
            })
        } else if (event.detail === 1) {
            wx.navigateTo({
                url: '../competeTips/competeTips',
            })
        } else if (event.detail === 2) {
            wx.navigateTo({
                url: '../mine/mine',
            })
        } else if (event.detail === 3) {
            wx.showToast({
                title: '功能正在完善中，尽请期待！',
                icon: 'none', //如果要纯文本，不要icon，将值设为'none'
                duration: 2000
            })
        }
    },
    onShow: function (options) {
        this.setData({
            suggestInfo: '',
        })
        if (app.globalData.userBaseInfo.isAuthed) {
            console.log("app.globalData.userBaseInfo.nickName", app.globalData.userBaseInfo.nickName)
            this.setData({
                userAvatarUrl: app.globalData.userBaseInfo.avatarUrl,
                userNickName: app.globalData.userBaseInfo.nickName,
                isAuthed: true,
            })
        } else {
            userBaseInfoCollection.where(_.or([{
                userOpenId: db.RegExp({
                    regexp: app.globalData.userOpenId
                })
            }])).get().then(res => {
                if (res.data[0]) {
                    console.log("res.data[0].userNickName", res.data[0]);
                    app.globalData.userBaseInfo.isAuthed = true;
                    app.globalData.userBaseInfo.avatarUrl = res.data[0].userAvatarUrl;
                    app.globalData.userBaseInfo.nickName = res.data[0].userNickName;
                    if (app.globalData.userBaseInfo.isAuthed) {
                        this.setData({
                            userAvatarUrl: res.data[0].userAvatarUrl,
                            userNickName: res.data[0].userNickName,
                            isAuthed: true,
                        })
                    }
                }

            })
        }
    },

    /*
    获取用户的头像和昵称信息
    */
   getUserProfile: function (e) {
        if (e.detail.userBaseInfo) {
            var time = new Date();
            userBaseInfoCollection.add({
                data: {
                    userAvatarUrl: e.detail.userBaseInfo.avatarUrl,
                    userNickName: e.detail.userBaseInfo.nickName,
                    lastLoginTime: time,
                    loginNum: 1,
                    userOpenId: app.globalData.userOpenId,
                    userOriginCode: app.globalData.userOriginCode,
                },
                success: res => {
                    this.setData({
                            userAvatarUrl: e.detail.userBaseInfo.avatarUrl,
                            userNickName: e.detail.userBaseInfo.nickName,
                            isAuthed: true,
                        }),
                        app.globalData.userBaseInfo.avatarUrl = e.detail.userBaseInfo.avatarUrl,
                        app.globalData.userBaseInfo.nickName = e.detail.userBaseInfo.nickName,
                        app.globalData.userBaseInfo.isAuthed = true;
                }
            })
        }
    },
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail 
      this.setData({
        avatarUrl,
      })
    },
  buttontap(e) {
    console.log(e.detail)
  },
  inputNickname: function (e) {
      if ((e.detail.nickName) !== '') {
          this.setData({
              nickName: e.detail.value
          });
          console.log(e);
      }
  },
  inputMajor: function (e) {
      if ((e.detail.major) !== '') {
          this.setData({
              major: e.detail.value
          });
          console.log(e);
      }
  },
  submitProfile: function (e) {
          var time = new Date();
          console.log(this.data)
          userBaseInfoCollection.add({
              data: {
                  userAvatarUrl: this.data.avatarUrl,
                  userNickName: this.data.nickName,
                  lastLoginTime: time,
                  loginNum: 1,
                  userOpenId: app.globalData.userOpenId,
                  userOriginCode: app.globalData.userOriginCode,
              },
              success: res => {
                      app.globalData.userBaseInfo.avatarUrl = e.detail.userBaseInfo.avatarUrl,
                      app.globalData.userBaseInfo.nickName = e.detail.userBaseInfo.nickName,
                      app.globalData.userBaseInfo.isAuthed = true;
                      this.setData({typeS: false})
              }
          })
  }
})