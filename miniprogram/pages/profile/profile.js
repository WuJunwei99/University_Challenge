const app = getApp()
const db = wx.cloud.database()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const userInfoCollection = db.collection('user_info')
Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    theme: wx.getSystemInfoSync().theme,
    nickName: '',
    major:'',
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  onTapToMine: function () {
    wx.navigateTo({
        url: '../mine/mine',
    })
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
        userInfoCollection.add({
            data: {
                userAvatarUrl: this.data.avatarUrl,
                userNickName: this.data.nickName,
                lastLoginTime: time,
                loginNum: 1,
                userOpenId: app.globalData.userOpenId,
                userOriginCode: app.globalData.userOriginCode,
                major: this.data.major
            },
            success: res => {
                    app.globalData.userinfo.avatarUrl = e.detail.userInfo.avatarUrl,
                    app.globalData.userinfo.nickName = e.detail.userInfo.nickName,
                    app.globalData.userinfo.isAuthed = true;
            }
        })
}
})
