// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    try {
        console.log("iddd:" + event.baiduPanUrl)
        return await db.collection('fileShare').where({
            baiduPanUrl: event.baiduPanUrl
        }).update({
            data: {
                downloadCount: _.inc(1)
            }
        })
    } catch (e) {
        console.error(e)
    }
}