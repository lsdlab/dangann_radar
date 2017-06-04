var app = getApp()
Page({
  data: {
    array: ['北京', '广州', '贵阳', '杭州', '南京', '上海', '深圳', '武汉'],
    index: 0,
    city: '北京',
    bathroom: '0',
    items: [
      {name: '有洗手间', value: '0'},
      {name: '无洗手间', value: '1', checked: true}
    ]
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
    var bathroom
    if (e.detail.value.bathroom == '1') {
      bathroom = '1'
    } else {
      bathroom = '0'
    }

    var city = e.detail.value.city
    var name = e.detail.value.spot_name
    var longitude = e.detail.value.longitude
    var latitude = e.detail.value.latitude
    var download_speed = e.detail.value.download_speed || ''
    var upload_speed = e.detail.value.upload_speed || ''
    var price_indication = e.detail.value.price_indication || ''
    var commit_message = e.detail.value.commit_message || ''

    if (name == '') {
      wx.showToast({
        title: '请输入名称',
        icon: 'error',
        duration: 1000
      })
    } else {
      var comment_request_url = "https://dangann.com/api/v1/spots/"
      wx.request({
        method: 'POST',
        data: {
           'city': city,
           'name': name,
           'longitude': longitude,
           'latitude': latitude,
           'download_speed': download_speed,
           'upload_speed': upload_speed,
           'price_indication': price_indication,
           'bathroom': bathroom,
           'commit_message': commit_message,
           'commit_user_name': wx.getStorageSync('user_data').username,
           'commit_user_id': wx.getStorageSync('user_data').id
        },
        url: comment_request_url,
        header: {
          'content-type':'application/x-www-form-urlencoded',
          'Authorization': 'JWT ' + wx.getStorageSync('api_token')
        },
        success: function(res) {
          var commit_data = res.data
          console.log('commit_data')
          console.log(commit_data)

          wx.showToast({
            title: '已提交',
            icon: 'success',
            duration: 2000
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
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude
        that.setData({
          longitude: longitude,
          latitude: latitude
        })
      }
    })
  },
})
