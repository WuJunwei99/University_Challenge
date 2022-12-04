// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
var today = new Date().toLocaleDateString()
const integralInfoDb = db.collection('integral_adjust_info')
const _ = db.command
const $ = db.command.aggregate
var today = new Date().toLocaleDateString()
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log("wxContext.OPENID",wxContext.OPENID)
    return await integralInfoDb.aggregate().match({
        _openid: wxContext.OPENID,
        createTime: _.gte(new Date(today+" 00:00:00"))
    })
    .group({
        _id: '$adjustReason',
        adjustNum: $.sum(1)
      }).end().then(res=>{
          console.log("getUserAllInfo",res);
          return res
      }) 

}