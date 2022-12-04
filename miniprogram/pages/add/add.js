// pages/add/add.js
//const cloud = require('wx-server-sdk')
const db = wx.cloud.database()
const testCollection = db.collection('test')
const competeTipsCollection = db.collection('competeTips')
Page({
    data: {

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
                title: "Kaggle竞赛案例讲解",
                avatar: "https://s1.ax1x.com/2022/10/23/x2FyTA.jpg",
                content: "Kaggle竞赛案例讲解，快来点击获取吧!",
                baiduPanUrl: "百度网盘链接:https://pan.baidu.com/s/1X1nW5btXx_AhMB5rFT-v7Q?pwd=92p2提取码:92p2",
                add_time: time,
                detail_time: time,
            },
            success: res => {
                console.log(res)
            }
        })

    },
})