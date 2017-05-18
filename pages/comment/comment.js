Page({
    data: {
      spot_name: '',
      spot_city: ''
    },
    formSubmit: function(e) {
      var that = this
      var comment_message = e.detail.value.comment
      var spot_id = e.detail.value.spot_id
      var spot_city = e.detail.value.spot_city

      var comment_request_url = "http://dangann.com/api/v1/comments/?format=json"
      wx.request({
        method: 'POST',
        data: {
           'spot_id': spot_id,
           'comment_message': comment_message,
           'comment_user_id': wx.getStorageSync('user_data').id,
           'comment_user_avatarurl': wx.getStorageSync('userInfo').avatarUrl,
           'comment_user_name': wx.getStorageSync('user_data').username,
           'comment_mark': 'comment',
           'spot_city': spot_city

        },
        url: comment_request_url,
        header: {
          'content-type':'application/x-www-form-urlencoded',
          'Authorization': 'JWT ' + wx.getStorageSync('api_token')
        },
        success: function(res) {
          var comment_data = res.data
          console.log('comment_data')
          console.log(comment_data)

          // var current_date = new Date()
          // var current_date_string = current_date.getFullYear().toString() + current_date.getMonth().toString() + current_date.getDay().toString()
          // var today_spot_commented_mark = spot_id + current_date_string + 'commented'
          // wx.setStorageSync(today_spot_commented_mark, 'commented')

          wx.showToast({
            title: '已评论',
            icon: 'success',
            duration: 2000
          })

          // wx.navigateBack({
          //   delta: 1
          // })

          // that.setData({
          //   commented_text: '已评论'
          // })
        }
      })
    },
    onLoad: function (options) {
      console.log('onLoad')
      var that = this
      var spot_id = options.spot_id
      var spot_name = options.spot_name
      var spot_city = options.spot_city

      that.setData({
        spot_name: spot_name,
        spot_id: spot_id,
        spot_name: spot_name,
        spot_city: spot_city
      })
  }
});
