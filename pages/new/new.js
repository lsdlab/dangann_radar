var app = getApp()
Page({
  data: {
    array: ['中国', '美国', '巴西', '日本'],
    bathroom: 0,
    items: [
      {name: '有洗手间', value: '0'},
      {name: '无洗手间', value: '1', checked: true}
    ]
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    var items = this.data.items;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }

    this.setData({
      items: items
    });
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
      var comment_request_url = "http://192.168.2.2:8000/api/v1/spots/?format=json"
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
          'content-type':'application/x-www-form-urlencoded'
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
