var _ = require( '../../libs/underscore-min.js' );

Page({
  data: {
    spot_name: '',
    spot_id: '',
    all_comment_list: []
  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    wx.showNavigationBarLoading()
    var spot_id = options.spot_id
    var spot_name = options.spot_name

    wx.setNavigationBarTitle({
      title: spot_name
    })
    var request_url = "http://dangann.com/api/v1/all_spot_comment_list/" + spot_id + "/?format=json"
    wx.request({
      url: request_url,
      header: {
          'content-type': 'application/json',
          'Authorization': 'JWT ' + wx.getStorageSync('api_token')
      },
      success: function(res) {
        var all_comment_list = res.data
        if (_.isEmpty(all_comment_list)) {
          all_comment_list = '1'
        }
        that.setData({
          all_comment_list: all_comment_list,
          spot_id: spot_id
        })

        wx.hideNavigationBarLoading()
      }
    })


  }
})
