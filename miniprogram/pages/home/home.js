// pages/home/home.js
import Toast from '@vant/weapp/toast/toast';
const db = wx.cloud.database()
const testCollection = db.collection('test')
const com = db.command
const _ = db.command
var app = getApp();
Page({
    data: {
        active: 0,
        icon: {
          normal: 'https://img.yzcdn.cn/vant/user-inactive.png',
          active: 'https://img.yzcdn.cn/vant/user-active.png',
        },
      },
      onChange(event) {
        this.setData({ active: event.detail });
      },
  addData: function (event) {
    console.log(event)
    var time = new Date();
 
    testCollection.add({
      data: {
        
        title: "第十一届蓝桥杯大赛",
        avatar: "https://mmbiz.qpic.cn/mmbiz_png/mU6yyVZ0x4LyQFtsmC3DowghhwuV2kxiaEULZJ6DZbFEjdsHibQO09GGHhnySsCAGwpXibZBRn8wV7VBicEa8oUT6Q/640?",
        content: "第十一届蓝桥杯大赛\n报名截止时间：2019年12月13日",
        detail: "计算机类",
        add_time: time,
        detail_time: time,
        website: "https://mp.weixin.qq.com/s/Ga6dexNo8gUa0xDchKVGQw"
      },
      success: res => {
        console.log(res)
      }
    })

  },

  onLoad: function (options) {
    var navs1;
    console.log("app",app)
    testCollection.where({
      show: db.RegExp({
        regexp: "yes"
      })
    }).orderBy('add_time', 'desc').get().then(res => {
      this.setData({
        test2: res.data
      })
    })
    db.collection('navs').orderBy('num', 'asc').get().then(res => {
      this.setData({
        bar: res.data
      })
    })
    var navs0 = "navs[0]"; 
    db.collection('navs').orderBy('num', 'asc').limit(8).get().then(res => {
      this.setData({
        [navs0]: res.data
      })
    })
    navs1 = "navs[1]"
 
    db.collection('navs').orderBy('num', 'asc').skip(8).get().then(res => {
      this.setData({
        [navs1]: res.data
      })
    })
    this.setData({
      active: 0,
      active_test:0,
      icon0: {
        normal: '/images/tab_index1.png',
        active: '/images/tab_index2.jpg'
      },
      icon1: {
        normal: '/images/search1.jpg',
        active: '/images/search2.jpg'
      },
      icon2: {
        normal: '/images/tab_course1.png',
        active: '/images/tab_course2.png'
      }
    })
    this.data.category = undefined
    var tmp = options.search
    console.log(tmp)
    if (typeof (tmp) != "undefined") {
      var inputValue = tmp
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
          category: undefined,
          inputValue: inputValue,
          test: res.data
        })
        this.setData({ show: false });
      })

    }
    else{
      var time = new Date();
      console.log(time)
      testCollection.orderBy('add_time', 'desc').get().then(res => {
        this.setData({
          test: res.data
        })
        this.setData({ show: false });
      })
    }


  },
  onTapToDetail0: function (res) {
    wx.navigateTo({
      url: '../complex/complex?id=' + res.currentTarget.dataset.name,
    })
    console.log(res.currentTarget.dataset.name);
  }, 
  onChange(event) {

    // event.detail 的值为当前选中项的索引
    if (event.detail == 0) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
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
  tapSearch: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  data: {
    show: false
  },

  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
  showCategory(event){
    var id = event.currentTarget.id
    console.log(id)
    if(id=="全部竞赛"){
      var time = new Date();
      console.log(time)
      testCollection.orderBy('add_time', 'desc').get().then(res => {
        this.setData({
          page:0,
          tmp: undefined,
          category: undefined,
          inputValue: undefined,
          test: res.data
        })
        this.setData({ show: false });
      })
    }
    else{
      testCollection.where({
        detail: db.RegExp({
          regexp: id
        })
      }).orderBy('add_time', 'desc').get().then(res => {
        this.setData({
          inputValue: undefined,
          category: id,
          test: res.data
        })
        this.setData({ show: false });
        this.setData({
          inputValue: ''
        })
      })
    }
      wx.showToast({
        icon: 'none',
        title: `已切换至“${id}”`
      })
  
  },
 
      data: {
        show:false,
        page:0,
        searchValue:'wd',
        category: undefined,
        inputValue: undefined
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
          category: undefined,
          inputValue: inputValue,
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
        category: undefined,
        inputValue: this.data.inputValue,
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
    console.log(event.currentTarget.id);
    var id = event.currentTarget.id
    wx.navigateTo({
      url: '../complex/complex?id='+id,
    })
  },


  onReachBottom:function(){
    let category = this.data.category
    let inputValue = this.data.inputValue
    console.log(inputValue)
    if (category != undefined && !inputValue){
      console.log("类型")
      let page = this.data.page + 20;
      testCollection.where({
        detail: db.RegExp({
          regexp: category
        })
      }).orderBy('add_time', 'desc').skip(page).get().then(res => {
        let new_data = res.data
        let old_data = this.data.test
        this.setData({
          test: old_data.concat(new_data),
          page: page
        }, res => {
      
        })
      }) 
    }
    else if (inputValue != undefined && category == undefined) {
      console.log("关键词")
      let page = this.data.page + 20;
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
      ])).orderBy('add_time', 'desc').skip(page).get().then(res => {
        let new_data = res.data
        let old_data = this.data.test
        this.setData({
          test: old_data.concat(new_data),
          page: page
        }, res => {
          console.log(res)
        })
      })
    }
     else{
      console.log("其他")
      let page = this.data.page + 20;
      testCollection.orderBy('add_time', 'desc').skip(page).get().then(res => {
        let new_data = res.data
        let old_data = this.data.test
        this.setData({
          test: old_data.concat(new_data),
          page: page
        }, res => {
          console.log(res)
        })
      }) 
     }
  },

  onTop:function()
{
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
}  ,
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
  onJumpSearch:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  addContest(){
    wx.navigateTo({
      url: '../add/add',
    })
  }
 

})    