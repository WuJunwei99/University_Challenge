// pages/add/add.js
const db = wx.cloud.database()
const testCollection = db.collection('test')
Page({
  data:{

  },
  addData: function (event){
    console.log(event)
    var time = new Date();
    testCollection.add({
      data: {
        title: "2019年APMCM亚太地区大学生数学建模竞赛",
        avatar: "https://mmbiz.qpic.cn/mmbiz_jpg/mU6yyVZ0x4Kh6ibOricGectQXib08g8fFN6lzh6IBazSDUTlibdHrcRSTfLOBctBScq6QgMAic1aichtmL0CibxL2ib6Eg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1",
        content: "2019年APMCM亚太地区大学生数学建模竞赛，注册截止日期：北京时间2019年11月27日（星期三）中午12点",
        detail:"数学建模",
        add_time:time,
        detail_time: time,
        website:"https://mp.weixin.qq.com/s/wnmG7YcnYCId1cY549YYRQ"
      },
      success:res => {
        console.log(res)
      }
    })
  
  }
})