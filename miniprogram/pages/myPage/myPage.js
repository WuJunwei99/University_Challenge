import Toast from '@vant/weapp/toast/toast';
var app = getApp();

const db = wx.cloud.database()
const userInfoCollection = db.collection('userInfo')
const suggestInfoCollection = db.collection('suggestInfo')
const com = db.command
const _ = db.command
Page({
    data: {
        showAboutUs:false,
        showSuggest:false,
        loading: true,
        active: 2,
        isAuthed:false,
        suggestInfo:'',
        icon: {
          normal: 'https://img.yzcdn.cn/vant/user-inactive.png',
          active: 'https://img.yzcdn.cn/vant/user-active.png',
        },
        userAvatarUrl:'',
        userNickName:'',
      },
      inputSuggestInfo : function (event) {
        if((event.detail.suggestInfo)!=''){
            this.setData({
                suggestInfo: event.detail
            });
            console.log(event);
        }9
      },
      submitSuggest : function (event) {
        console.log("submitSuggest",this.data.suggestInfo);
        if(this.data.suggestInfo!=""){
          var time = new Date();
          suggestInfoCollection.add({
            data: {
              userOpenId:app.globalData.userOpenId,
              suggestInfo:this.data.suggestInfo,
              add_time: time,
            },
            success: res => {
              Toast.success('反馈成功，感谢您的支持！');
            }
          })
        }else{
          Toast.fail('所填为空！');
        }
        this.showSuggestClose()
      },
      showAboutPopup() {
        this.setData({ showAboutUs: true });
      },
    
      showAboutClose() {
        this.setData({ showAboutUs: false });
      },

      showSuggestPopup() {
        this.setData({ showSuggest: true });
      },
    
      showSuggestClose() {
        this.setData({ 
            showSuggest: false ,
            suggestInfo:""
        });
      },

      onReady() {
        this.setData({
          loading: false,
        });
      },
      onChange(event) {
        this.setData({ active: event.detail });
      },
      onChange(event) {
        // event.detail 的值为当前选中项的索引
        if (event.detail == 0) {
            wx.navigateTo({
                url: '../home/home',
            })
        }
        else if (event.detail==1){
          wx.navigateTo({
            url: '../competeTips/competeTips',
          })
        }
        else if (event.detail==2){
            wx.navigateTo({
              url: '../myPage/myPage',
            })
          }
        else if (event.detail == 3) {
          wx.showToast({
            title: '功能正在完善中，尽请期待！',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 2000
          })
        }
      },
      onLoad:function(options){
        this.setData({
            suggestInfo: '',
        })
          if(app.globalData.userinfo.isAuthed){
            this.setData({
                userAvatarUrl:app.globalData.userinfo.avatarUrl,
                userNickName:app.globalData.userinfo.nickName,
                isAuthed:true,
            })
          }else{
            userInfoCollection.where(_.or([
                {
                    userOpenId: db.RegExp({
                    regexp: app.globalData.userOpenId
                  })
                }
              ])).get().then(res => {
                    app.globalData.userinfo.isAuthed = true;
                    app.globalData.userinfo.userAvatarUrl =res.data[0].userAvatarUrl;
                    app.globalData.userinfo.userNickName =res.data[0].userNickName;
                    if(app.globalData.userinfo.isAuthed){
                        this.setData({
                            userAvatarUrl:res.data[0].userAvatarUrl,
                            userNickName:res.data[0].userNickName,
                            isAuthed:true,
                        })
                      }
                })
          }
      },
      /*
      获取用户的头像和昵称信息
      */ 
      getUserInfo:function(e){
          if(e.detail.userInfo){
            var time = new Date();
            userInfoCollection.add({
                data: {
                    userAvatarUrl:e.detail.userInfo.avatarUrl,
                    userNickName:e.detail.userInfo.nickName,
                    lastLoginTime: time,
                    loginNum:1,
                    userOpenId:app.globalData.userOpenId,
                    userOriginCode:app.globalData.userOriginCode,
                },
                success: res => {
                console.log(res)
                }
            })
            this.setData({
                userAvatarUrl:e.detail.userInfo.avatarUrl,
                userNickName:e.detail.userInfo.nickName,
                isAuthed:true,
            }),
            app.globalData.userinfo.avatarUrl=e.detail.userInfo.avatarUrl,
            app.globalData.userinfo.nickName=e.detail.userInfo.nickName,
            app.globalData.userinfo.isAuthed = true;
          }
        console.log(e);
      }

})