var app = getApp();

const db = wx.cloud.database()
const competeTipsCollection = db.collection('fileShare')
const com = db.command
const _ = db.command
Page({
    data: {
        showTipsDeatil: false,
        competeTips: '',
        active: 1,
        baiduPanUrl: '',
        fileShareButtons: [{
            text: '关闭'
        }]
    },

    showTipsDetail(event) {
        console.log(event.currentTarget.id)
        this.setData({
            showTipsDeatil: true,
            baiduPanUrl: event.currentTarget.id,
        });
    },

    tapFileDetail(e) {
        const _btn = e.detail.item.text;
        this.setData({
            showTipsDeatil: false
        })
    },

    closeTipsDetail() {
        this.setData({
            showTipsDeatil: false
        });

    },

    onReady() {
        console.log("onready")
        this.setData({
            loading: false,
        });
    },
    onChange(event) {
        console.log("onchange1")
        this.setData({
            active: event.detail
        });
    },
    onLoad(options) {
        console.log("onload");
        db.collection('fileShare').get().then(res => {
            console.log("res:" + res.data)
            this.setData({
                competeTips: res.data,
                show: false
            });
        })
    },


})