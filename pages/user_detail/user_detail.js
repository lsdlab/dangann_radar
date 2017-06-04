var util = require('../../utils/util.js')
var _ = require( '../../libs/underscore-min.js' );

Page({
  data: {
    all_user_comment_list: {},
    user_detail: {}
  },
  // 事件处理函数

  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    var user_id = options.user_id.split('@')[0]
    var user_name = options.user_id.split('@')[1]
    var user_detail = {}
    var all_user_comment_list = {}
    if (user_id) {
      var user_detail_request_url = "https://dangann.com/api/v1/users/" + user_id + "/?format=json"
      wx.request({
        url: user_detail_request_url,
        header: {
          'content-type': 'application/json',
          'Authorization': 'JWT ' + wx.getStorageSync('api_token')
        },
        success: function(res) {
          user_detail = res.data
          var shareData = {}
          shareData.title = user_detail.weixin_nickName
          shareData.path = '/pages/user_detail/user_detail?user_id=' + user_id.toString()
          that.setData({
            user_detail: user_detail,
            shareData: shareData,
          })
        }
      })

      var all_user_comment_list_request_url = "https://dangann.com/api/v1/all_user_comment_list/" + user_id + "/?format=json"
      wx.request({
        url: all_user_comment_list_request_url,
        header: {
          'content-type': 'application/json',
          'Authorization': 'JWT ' + wx.getStorageSync('api_token')
        },
        success: function(res) {
          all_user_comment_list = res.data
          that.setData({
            all_user_comment_list: all_user_comment_list,
          })
        }
      })
    } else {
      user_detail['weixin_nickName'] = user_name
    }

    that.setData({
      user_detail: user_detail
    })



  },
  onShareAppMessage: function () {
    return this.data.shareData
  }
})
