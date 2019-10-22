// pages/home/home.js

import Toast from 'vant-weapp/toast/toast';
const db = wx.cloud.database()
const testCollection = db.collection('test')
const com = db.command
const _ = db.command
Page({
  onLoad: function (options) {
    var time = new Date();
    console.log(time)
    testCollection.orderBy('add_time', 'desc').get().then(res => {
      this.setData({
        test: res.data
      })
      this.setData({ show: false });
    })

  },
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: '',
      path: '/pages/home/home',
      success: function (res) {
        // 转发成功

        that.shareClick();
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },


  showCategory(event){
    var id = event.currentTarget.id
    testCollection.where({
      detail: db.RegExp({
        regexp: id
      })
    }).get().then(res => {
      this.setData({
        test: res.data
      })
      this.setData({ show: false });
      this.setData({
        inputValue: ''
      })
    })
  
  },
 
      data: {
        show:false,
        page:0,
        searchValue:'wd',
      },
    
  inputBind: function (event) {
    this.setData({
      inputValue: event.detail.value
    })
  },
  searchTest: function (event) {
    var inputValue = event.detail.value
    console.log(inputValue)
    testCollection.where(_.or([
      {
        detail: db.RegExp({
          regexp: inputValue
        })
      },
      {
        title: db.RegExp({
          regexp: inputValue
        })
      }
    ])).get().then(res => {
        this.setData({
          test: res.data
        })
        this.setData({ show: false });
        this.setData({
          inputValue: ''
        })
      })
  },
  searchTest0: function (event) {
   
    testCollection.where(_.or([
      {
        detail: db.RegExp({
          regexp: this.data.inputValue
        })
      },
      {
        title: db.RegExp({
          regexp: this.data.inputValue
        })
      }
    ])).get().then(res => {
      this.setData({
        test: res.data
      })
      this.setData({ show: false });
      this.setData({
        inputValue: ''
      })
    })
  },

      showPopup() {
        this.setData({ show: true });
      },

      onClose() {
        this.setData({ show: false });
      },

  orderBy:function(event){
    var time = new Date() ;
    console.log(time)
    testCollection.where({
      detail_time: com.gt(time)
    }).get().then(res => {
      this.setData({
        test: res.data
      })
      this.setData({ show: false });
    })

  },
  onTapToAll(event) {
    var id = event.currentTarget.id
    wx.navigateTo({
      url: '../home/home',
    })
  },
  onTapToDetail(event){
    var id = event.currentTarget.id
    wx.navigateTo({
      url: '../complex/complex?id='+id,
    })
  },
  onReachBottom:function(){
    console.log("到底了~")
    let page = this.data.page + 20;
    console.log(page)
    
    testCollection.skip(page).get().then(res => {
      let new_data=res.data
      let old_data=this.data.test
      this.setData({
        test:old_data.concat(new_data),
        page:page
      },res=>{
        console.log(res)
      })
     
    }) 
  },

  
  onTapJump: function (event) {
    wx.navigateTo({
      url: '../home/home',
      success: function () {
        console.log("jump success")
      },
      fail: function () {
        console.log("jump failed");
      },
      complete: function () {
        console.log("jump complete")
      }
    })
  },
  addContest(){
    wx.navigateTo({
      url: '../add/add',
    })
  },
  popTest: function () {
    wx.showToast({
      title: '功能正在完善中，尽请期待！',
      icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
      duration: 2000
    })
  }



})