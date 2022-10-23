var app = getApp();

const db = wx.cloud.database()
const competeTipsCollection = db.collection('competeTips')
const com = db.command
const _ = db.command
Page({
    data: {
        showTipsDeatil:false,
        competeTips:'',
        active: 1,
        baiduPanUrl:''
      },

      showTipsDetail(event) {
        console.log(event.currentTarget.id)
        this.setData({ 
            showTipsDeatil:true,
            baiduPanUrl:event.currentTarget.id,
        });
      },
    
      closeTipsDetail() {
        this.setData({
             showTipsDeatil: false
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
        competeTipsCollection.get().then(res => {
            this.setData({
                competeTips: res.data
            })
            this.setData({ show: false });
          })
      },


})