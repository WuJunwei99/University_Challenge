var app = getApp();

const db = wx.cloud.database()
const competeTipsCollection = db.collection('fileShare')
Page({
    data: {
        showTipsDeatil: false,
        active: 1,
        baiduPanUrl: '',
        fileShareButtons: [{
            text: '关闭'
        }],

        competeTips: [],
        hotTags: [],
        downloadRank: []
    },

    showTipsDetail(event) {
        console.log(event.currentTarget.id)
        wx.cloud.callFunction({
            // 云函数名称
            name: 'updateTips',
            // 传给云函数的参数
            data: {
                baiduPanUrl: event.currentTarget.id
            },
          })
          .then(res => {
            console.log(res.result) // 3
          })
          .catch(console.error)
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

    onMorePress(e) {
        const type = e.currentTarget.dataset.type
        console.log(type);
        if (type === 'recommend') {
            wx.navigateTo({
                url: '../fileSharingMore/fileSharingMore?title=优选资源&type=' + type,
            })
        } else if (type === 'rank') {
            wx.navigateTo({
                url: '../fileSharingMore/fileSharingMore?title=排行榜&type=' + type,
            })
        } else if (type === 'hotTag') {
            const tag = e.currentTarget.dataset.tag
            wx.navigateTo({
                url: '../fileSharingMore/fileSharingMore?title=' + tag + '&type=' + type,
            })
        }
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
            console.log("res:" + JSON.stringify(res.data))
            const hotTags = [];
            res.data.forEach(info => {
                if (info.tag?.length > 0) {
                    hotTags.push(...info.tag);
                }
            })

            const downloadRank = [...res.data];
            downloadRank.sort(function(a, b) {
                return b.downloadCount - a.downloadCount;
            })

            console.log("tag:" + hotTags);
            this.setData({
                competeTips: res.data.slice(0, 3),
                hotTags,
                downloadRank: downloadRank.slice(0, 3),
                show: false
            });
        })
    },
})