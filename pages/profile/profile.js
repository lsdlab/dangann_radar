var app = getApp()
Page({
  data: {
    open_mark: '1'
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  formSubmit: function(e) {
    var that = this
    var open_mark
    if (e.detail.value.open_mark == '1') {
      open_mark = '1'
    } else {
      open_mark = '0'
    }

    var location = e.detail.value.location
    var weixin = e.detail.value.weixin || ''
    var bio = e.detail.value.bio || ''

    if (location == '') {
      wx.showToast({
        title: '请输入常住城市',
        icon: 'error',
        duration: 1000
      })
    } else {
      var update_weixin_user_request_url = "http://dangann.com/api/v1/update_weixin_user/" + wx.getStorageSync('user_data').id + '/'
      wx.request({
        method: 'POST',
        data: {
           'location': location,
           'weixin': weixin,
           'bio': bio,
           'open_mark': open_mark
        },
        url: update_weixin_user_request_url,
        header: {
          'content-type':'application/x-www-form-urlencoded',
          'Authorization': 'JWT ' + wx.getStorageSync('api_token')
        },
        success: function(res) {
          var user_data = res.data
          console.log('user_data')
          console.log(user_data)

          wx.showToast({
            title: '已更新',
            icon: 'success',
            duration: 2000
          })

          // wx.redirectTo({ url: './index/index'})
        }
      })
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    var user_data = wx.getStorageSync('user_data')

    if (user_data.open_mark == true) {
      user_data.open_mark = '1'
    } else {
      user_data.open_mark = '0'
    }

    that.setData({
      user_data: user_data,
    })



    if (user_data.location == '') {
      wx.showToast({
        title: '首次使用，请输入常住城市',
        icon: 'info',
        duration: 2000
      })
    }

  },
})
