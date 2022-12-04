wx.cloud.init();
const db = wx.cloud.database()
const appInfoDb = db.collection('appInfo')
const userEventInfoDb = db.collection('user_event_info')
const userShareInfoDb = db.collection('user_share_info')
const userBaseInfoDb = db.collection('user_base_info')
const integralInfoDb = db.collection('integral_adjust_info')


App({
    onLaunch: function () {
        appInfoDb.get().then(res => {
            this.appid = res.data[0].appid
            this.secret = res.data[0].secret
        })
        this.globalData = {
            userBaseInfo: {},
            userOriginCode: '',
            userOpenId: '',
            userLoginInfo:{},
            lastIntegralInfo:{},
            todayIngegral:[]
        }
        wx.login({
            success: (result) => {
                this.getUserAllInfo(this.globalData)
            }
        })

        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                // env: 'my-env-id',
                env: 'wujunwei-g1f9z',
                traceUser: true,
            })
        }


        const updateManager = wx.getUpdateManager()

        updateManager.onCheckForUpdate(function (res) {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate)
        })

        updateManager.onUpdateReady(function () {
            wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })

        updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
                title: '更新提示',
                content: '新版本下载失败',
                showCancel: false
            })
        })
    },

//组装用户的全部信息放入全局变量中
    async getUserAllInfo(globalData){
        //获取并设置openId
        globalData.userOpenId = await this.getUserOpenId();
        if(!globalData.userOpenId){
            return;
        }

        //获取用户基本信息
        globalData.userBaseInfo = await this.getUserBaseInfo(globalData.userOpenId);

        //获取今日已获得的积分详情
        globalData.todayIngegral = await this.getTodayIngegral();

        //获取最后的积分值
        globalData.lastIntegralInfo = await this.getLastIntegral(globalData.userOpenId);

        //新增登陆信息
        await this.addUserLoginInfo(globalData);

        console.log("globalDataUserInfo",globalData);
    },

    //获取openId
    async getUserOpenId(){
        return wx.cloud.callFunction({
            name: 'getUserOpenId',
        })
        .then(res => {
            return res.result.openid;
        })
    },

    //获取用户基本信息
    async getUserBaseInfo(userOpenId){
        return await userBaseInfoDb.where({
            _openid: userOpenId
        }).get().then(res => {
            console.log("getUserBaseInfo",res.data[0]);
            return  res.data[0];
        })
    },

    //获取最后一条积分项
    async getLastIntegral(userOpenId){
        console.log("this.globalData.userOpenId",userOpenId);
        return await integralInfoDb.where({
            _openid: userOpenId
        }).orderBy('createTime', 'desc').get().then(res => {
            return  res.data[0];
        })
    },

    //获取今日积分情况
    async getTodayIngegral(){
        return  wx.cloud.callFunction({
            name: 'getTodayIntegral',
        })
        .then(res => {
            return res.result.list
        })
    },

    //获取积分信息
    async getIntgralInfo(){
        // console.log("this.globalData.userOpenId",this.globalData.userOriginCode);
        // var today = new Date().toLocaleDateString()
        // await integralInfoDb.where({
        //     _openid: this.globalData.userOriginCode,
        //     createTime: _.gte(new Date(today+" 00:00:00"))
        // }).aggregate()
        // .group({
        //     // 按 category 字段分组
        //     _openid: '$adjustReason',
        //     // 让输出的每组记录有一个 avgSales 字段，其值是组内所有记录的 sales 字段的平均值
        //     adjustNum: $.sum(1)
        //   }).end()
        // .orderBy('createTime', 'desc').get().then(res => {
        //     this.globalData.integralAdjustInfoArray = res;
        //     console.log("this.globalData.integralAdjustInfoArray",this.globalData.integralAdjustInfoArray);
        // })
        
    },

    //新增看广告事件的eventInfo和integralInfo
    async addUserAdvertInfo(globalData){
        var eventId = await this.addUserEventInfo("advert")
        if(eventId){
            await this.addIntegralInfo("advert",10,eventId);
            //获取今日已获得的积分详情
            globalData.todayIngegral = await this.getTodayIngegral();
            //获取最后的积分值
            globalData.lastIntegralInfo = await this.getLastIntegral(globalData.userOpenId);
        }
    },

    //新增分享事件的eventInfo和integralInfo
    async addUserShareInfo(globalData){
        var eventId = await this.addUserEventInfo("share")
        if(eventId){
            if(globalData.todayIngegral){
                var todayShareInfo = globalData.todayIngegral.find(function(item,index){
                    if(item._id == "share"){
                        return item
                    }
                    return ;
                })
                if(!todayShareInfo || (todayShareInfo && todayShareInfo.adjustNum <3)){
                    await this.addIntegralInfo("share",1,eventId);
                    //获取今日已获得的积分详情
                    globalData.todayIngegral = await this.getTodayIngegral();
                    //获取最后的积分值
                    globalData.lastIntegralInfo = await this.getLastIntegral(globalData.userOpenId);
                }
            }
        }
    },

    //新增登陆事件的eventInfo和integralInfo
    async addUserLoginInfo(globalData){
        var eventId = await this.addUserEventInfo("login")
        if(eventId){
            if(globalData.todayIngegral){
                var todayShareInfo = globalData.todayIngegral.find(function(item,index){
                    if(item._id == "login"){
                        return item
                    }
                    return ;
                })
                if(!todayShareInfo || (todayShareInfo && todayShareInfo.adjustNum == 0)){
                    await this.addIntegralInfo("login",1,eventId);
                    //获取今日已获得的积分详情
                    globalData.todayIngegral = await this.getTodayIngegral();
                    //获取最后的积分值
                    globalData.lastIntegralInfo = await this.getLastIntegral(globalData.userOpenId);
                }
            }
        }
    },
    
    //新增事件信息
    async addUserEventInfo (eventType) {
        return await userEventInfoDb.add({
            data: {
                createTime: new Date(),
                eventType : eventType,
            }
        }).then(res => {
            return res._id
        })        
    },

    // //新增登陆信息
    // addUserEventInfo (eventType) {
    //     let promise = new Promise(
    //         function(success,fail){
    //             userEventInfoDb.add({
    //                 data: {
    //                     eventType : eventType,
    //                     createTime: new Date(),
    //                 },
    //             success(res){
    //                 await this.addIntegralInfo("share",1,shareId)
    //             }   
    //         })
    //         })
    //     return promise;
        
    // },

    //新增分享信息
    // async addUserShareInfo () {
    //     return await userShareInfoDb.add({
    //         data: {
    //             createTime: new Date(),
    //             loginTime: new Date(),
    //         }
    //     }).then(res => {
    //         return res._id
    //     })        
    // },

    //新增积分项
    async addIntegralInfo(adjustReason,adjustValue,eventId){
        console.log("addIntegralInfo入参",adjustReason,adjustValue,eventId)
        var adjustBeforeIntegral = 0;
        var lastIntegralInfo =  await this.getLastIntegral();
        if(lastIntegralInfo){
            adjustBeforeIntegral = lastIntegralInfo.adjustAfterIntegral;
        }

        integralInfoDb.add({
            data: {
                adjustBeforeIntegral: adjustBeforeIntegral,
                adjustAfterIntegral: adjustBeforeIntegral+adjustValue,
                adjustValue: adjustValue,
                adjustReason: adjustReason,
                eventId: eventId,
                createTime:new Date()
            }
        }).then(res => {
            console.log("addIntegralInfo",res)
        })
    },


})