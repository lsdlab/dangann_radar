var util = require('../../utils/util.js')
var _ = require( '../../libs/underscore-min.js' );

Page({
  data: {
    user_detail: {}
  },
  // 事件处理函数

  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    var user_id = options.user_id
    var user_detail_request_url = "http://dangann.com/api/v1/users/" + user_id + "/?format=json"
      wx.request({
        url: user_detail_request_url,
        header: {
          'content-type': 'application/json',
          'Authorization': 'JWT ' + wx.getStorageSync('api_token')
        },
        success: function(res) {
          var user_detail = res.data
          var shareData = {}
            shareData.title = user_detail.weixin_nickName
            shareData.path = '/pages/user_detail/user_detail?user_id=' + user_id.toString()
            that.setData({
              shareData: shareData,
            })
          that.setData({
            user_detail: user_detail
          })
        }
      })


  },
  onShareAppMessage: function () {
    return this.data.shareData
  }
})
