// pages/add/add.js
const db = wx.cloud.database()
const testCollection = db.collection('test')
const competeTipsCollection = db.collection('competeTips')
Page({
  data:{

  },
  

  addData: function (event) {
    console.log(event)
    var time = new Date();
    testCollection.add({
      data: {
        title: "广东“众创杯”创业创新大赛",
        avatar: "https://mmbiz.qpic.cn/mmbiz_png/mU6yyVZ0x4KsflpxzGANF783Ln0KskaeAomQ3XIRZicNh0bmdzwIXzenWzmPzzZbMFfVNsTZbSlyJhb01jnnDgg/640?",
        content: "大赛报名：2020年6月1日至7月15日",
        detail: "创新创业",
        add_time: time,
        detail_time: time,
        website: "https://mp.weixin.qq.com/s/H58QGW5tkVVHgH3y2eVfYA"
      },
      success: res => {
        console.log(res)
      }
    })

  },

  addTipsData: function (event) {
    console.log(event)
    var time = new Date();
    competeTipsCollection.add({
      data: {
        title: "java后端学习资料",
        avatar: "https://s1.ax1x.com/2022/10/23/xgjlE8.png",
        content: "包含视频教学、示例代码，快来点击获取吧!",
        baiduPanUrl:"百度网盘链接:https://pan.baidu.com/s/1y9fUUHAw4RNfM3spbP27LA?pwd=2xbf \n提取码:2xbf",
        add_time: time,
        detail_time: time,
      },
      success: res => {
        console.log(res)
      }
    })

  },
})