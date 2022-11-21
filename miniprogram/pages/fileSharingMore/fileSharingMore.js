
const db = wx.cloud.database()
const competeTipsCollection = db.collection('fileShare')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "",
        tips: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log("onchange1onLoad options:" + JSON.stringify(options))
        this.setData({
            title: options.type === "hotTag" ? ("#" + options.title) : options.title ,
            type: options.type
        })
        wx.setNavigationBarTitle({
            title: options.type === "hotTag" ? ("#" + options.title) : options.title 
          })
        db.collection('fileShare').get().then(res => {
            let data = res.data;
            if (options.type === "rank") {
                data.sort(function(a, b) {
                    return b.downloadCount - a.downloadCount;
                })
            } else if (options.type === "hotTag") {
                data = data.filter(item => item.tag.includes(options.title));
            }
            this.setData({
                tips: data.slice(0, 10)
            });
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        console.log("onchange1onReady")
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})