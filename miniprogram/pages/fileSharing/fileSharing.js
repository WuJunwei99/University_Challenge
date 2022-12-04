var app = getApp();

const db = wx.cloud.database()
const competeTipsCollection = db.collection('fileShare')
let rewardedVideoAd = null
Page({
    data: {
        showTipsDeatil: false,
        active: 1,
        baiduPanUrl: '',
        nowProfile:'',
        fileShareButtons: [{
            text: '关闭'
        }],
        feedbackDialogButtons: [{
            text: '取消'
        }, {
            text: '确认兑换'
        }],
        competeTips: [],
        hotTags: [],
        downloadRank: []
    },

    showUseProfilePopup(event) {
        console.log(event.currentTarget)
       
        this.setData({
            showUseProfile: true,
            nowProfile: app.globalData.lastIntegralInfo.adjustAfterIntegral,
            fileName: event.currentTarget.fileName,
        });

    },

    showUseProfileClose() {
        this.setData({
            showUseProfile: false
        });
    },

    tapFeedback(e) {
        const _btn = e.detail.item.text;
        if (_btn == '确认兑换') {
            this.useProfile();
            return;
        }
        this.showUseProfileClose();
    },
    
    useProfile(){

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

        if(wx.createRewardedVideoAd){
            rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId: 'adunit-2d7e5a8bd48d29ce' })
            rewardedVideoAd.onLoad(() => {
                console.log('激励视频 广告加载成功')
            })
            rewardedVideoAd.onError((err) => {
              console.log('onError event emit', err)
            })
            rewardedVideoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                if (res && res.isEnded) {
                  // 正常播放结束，可以下发游戏奖励
                  app.addUserAdvertInfo(app.globalData)
                } else {
                  // 播放中途退出，不下发游戏奖励
                }
            })


          }
    },
    showVideoAd(){
        rewardedVideoAd.show()
        .catch(() => {
            rewardedVideoAd.load()
            .then(() => rewardedVideoAd.show())
            .catch(err => {
            console.log('激励视频 广告显示失败')
            })
        })
    },


})