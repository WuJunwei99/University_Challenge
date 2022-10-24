// pages/add/add.js
const db = wx.cloud.database()
const testCollection = db.collection('test')
const com = db.command
const _ = db.command
Page({

    onLoad: function (options) {
        testCollection.where({
                state: db.RegExp({
                    regexp: "hot"
                })
            }).orderBy('add_time', 'desc').get().then(res => {
                this.setData({
                    test: res.data
                })
            }),

            this.setData({
                disabled: true,
                inputValue: '',
                inputVal: "",
                showvalue: "热门竞赛",
                active: 1,
                icon0: {
                    normal: '/images/tab_index1.png',
                    active: '/images/tab_index2.jpg'
                },
                icon1: {
                    normal: '/images/search1.jpg',
                    active: '/images/search2.jpg'
                },
                icon2: {
                    normal: '/images/tab_course1.png',
                    active: '/images/tab_course2.png'
                }
            })


    },

    onChange(event) {
        // event.detail 的值为当前选中项的索引
        if (event.detail == 0) {
            wx.navigateTo({
                url: '../home/home',
            })
        } else if (event.detail == 1) {

        } else if (event.detail == 2) {
            wx.showToast({
                title: '功能正在完善中，尽请期待！',
                icon: 'none', //如果要纯文本，不要icon，将值设为'none'
                duration: 2000
            })
        }
    },



    searchTest0: function (event) {
        wx.navigateTo({
            url: '../home/home?search=' + this.data.inputVal,
            success: function (res) {
                // success
            },
            fail: function () {
                // fail
            },
            complete: function () {
                // complete
            }
        })


    },
    inputBind: function (event) {
        console.log(event.detail.value)
        if ((event.detail.value) != '') {
            this.setData({
                inputVal: event.detail.value
            });
            var inputVal = this.data.inputVal
            console.log(this.data.inputVal);
            testCollection.where(_.or([{
                    detail: db.RegExp({
                        regexp: inputVal
                    })
                },
                {
                    title: db.RegExp({
                        regexp: inputVal
                    })
                }
            ])).get().then(res => {
                if (res.data.length == 0) {
                    this.setData({
                        disabled: true,
                        showvalue: "暂无搜索结果",
                        show: false,
                        test: ''
                    })
                } else {
                    this.setData({
                        showvalue: "搜索结果",
                        test: res.data,
                        disabled: false
                    })
                }
            })
        } else {
            this.setData({
                disabled: true,
                showvalue: "热门竞赛"
            })
            testCollection.where({
                state: db.RegExp({
                    regexp: "hot"
                })
            }).orderBy('add_time', 'desc').get().then(res => {
                this.setData({
                    test: res.data
                })
            })
        }
    },
    btn_name: function (res) {
        wx.navigateTo({
            url: '../articleDetail/articleDetail?id=' + res.currentTarget.dataset.name,
        })
        console.log(res.currentTarget.dataset.name);
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
    }


})