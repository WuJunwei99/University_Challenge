// pages/add/add.js
const db = wx.cloud.database()
const testCollection = db.collection('test')
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
})