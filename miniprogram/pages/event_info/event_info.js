// pages/course/course.js
var util = require("../../utils/util.js");
Page({
  data: {
    courses: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log("onLoad");
    var that = this;
    var coursesArr = [
      {
        title: "英语竞赛"
      },
      {
        title: "计算机类"
      },
      {
        title: "数学建模"
      },
      {
        title: "创新创业"
      },
      {
        title: "生物化学"
      },
      {
        title: "财经金融"
      }
    ];
    that.setData({
      courses: coursesArr
    });
    console.log("onLoad");
    console.log(coursesArr);
    console.log("onLoad");
  },

  showCategory(event) {
    var id = event.currentTarget.id
    testCollection.where({
      detail: db.RegExp({
        regexp: id
      })
    }).get().then(res => {
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

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  selectTab: function (event) {
    var that = this,
      index = event.currentTarget.id,
      coursesArr = that.data.courses;
    console.log(index);

  }
})