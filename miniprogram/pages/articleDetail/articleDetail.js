// pages/complex/complex.js
const db = wx.cloud.database()
const testCollection = db.collection('test')
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        testCollection.where({
            _id: id
        }).get().then(res => {
            this.setData({
                test: res.data
            })
            this.setData({
                show: false
            });
        })
        testCollection.doc(id).update({
            data: {
                readingNum: _.inc(1)
            }
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
    returnHome: function (event) {
        wx.navigateTo({
            url: '../home/home',
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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },


})