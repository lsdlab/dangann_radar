var app = getApp()
Page({
  data: {
    array: ['北京', '广州', '贵阳', '杭州', '南京', '上海', '深圳', '武汉'],
    index: 0,
    city: '北京',
    open_mark: '1'
  },
  bindPickerChange: function(e) {
    var city_dict = {
      '0': '北京',
      '1': '广州',
      '2': '贵阳',
      '3': '杭州',
      '4': '南京',
      '5': '上海',
      '6': '深圳',
      '7': '武汉',
    }
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      city: city_dict[e.detail.value]
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
      var update_weixin_user_request_url = "https://dangann.com/api/v1/update_weixin_user/" + wx.getStorageSync('user_data').id + '/'
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
          var user_detail = res.data
          console.log('user_detail')
          console.log(user_detail)

          wx.showToast({
            title: '已更新',
            icon: 'success',
            duration: 2000
          })

          var user_id = wx.getStorageSync('user_data').id
          var user_detail_request_url = "http://dangann.com/api/v1/users/" + user_id + "/?format=json"
          wx.request({
            url: user_detail_request_url,
            header: {
              'content-type': 'application/json',
              'Authorization': 'JWT ' + wx.getStorageSync('api_token')
            },
            success: function(res) {
              var user_detail = res.data
              that.setData({
                user_detail: user_detail
              })
              wx.setStorageSync('user_data', user_detail)
            }
          })
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
    var user_detail = wx.getStorageSync('user_data')

    if (user_detail.open_mark == true) {
      user_detail.open_mark = '1'
    } else {
      user_detail.open_mark = '0'
    }

    that.setData({
      user_detail: user_detail,
    })

    if (user_detail.location == '') {
      wx.showToast({
        title: '首次使用，请输入常住城市',
        icon: 'info',
        duration: 2000
      })
    }
  }
})
