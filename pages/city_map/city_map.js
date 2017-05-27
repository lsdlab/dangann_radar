var _ = require( '../../libs/underscore-min.js' );

Page({
  data: {
    markers: [],
    spot_list: [],
    city_name: ''
  },
  //事件处理函数
  bindViewTap: function(event) {
    wx.navigateTo({
      url: '../spot_detail/spot_detail?spot_id=' + event.currentTarget.id
    })
  },
  markertap: function(event) {
    var that = this

    console.log(event.markerId)
    var spot_id = event.markerId
    var request_url = "https://dangann.com/api/v1/spots/" + spot_id.toString() + "/?format=json"
    wx.request({
      url: request_url,
      header: {
          'content-type': 'application/json',
          'Authorization': 'JWT ' + wx.getStorageSync('api_token')
      },
      success: function(res) {
        var spot_data = res.data
        that.setData({
          spot_data: spot_data,
          spot_id: spot_id
        })

        var shareData = {}
        shareData.title = spot_data.name
        shareData.path = '/pages/spot_detail/spot_detail?spot_id=' + spot_id.toString()
        that.setData({
          shareData: shareData,
        })
      }
    })
  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    wx.showNavigationBarLoading()
    var city_name = options.city_name
    that.setData({
      city_name: city_name
    })
    wx.setNavigationBarTitle({
      title: city_name
    })
f    var request_url = "https://dangann.com/api/v1/city_spot_list_for_map/" + city_name + "/"
    wx.request({
      url: request_url,
      header: {
          'content-type': 'application/json',
          'Authorization': 'JWT ' + wx.getStorageSync('api_token')
      },
      success: function(res) {
        var spot_list = res.data
        that.setData({
          spot_list: spot_list,
          spots_count: spot_list.length
        })

        var longitude = spot_list[0].longitude
        var latitude = spot_list[0].latitude

        var spot_id = spot_list[0].id
        var request_url = "https://dangann.com/api/v1/spots/" + spot_id.toString() + "/?format=json"
          wx.request({
            url: request_url,
            header: {
                'content-type': 'application/json',
                'Authorization': 'JWT ' + wx.getStorageSync('api_token')
            },
            success: function(res) {
              var spot_data = res.data
              that.setData({
                spot_data: spot_data,
                spot_id: spot_id
              })

              var shareData = {}
              shareData.title = spot_data.name
              shareData.path = '/pages/spot_detail/spot_detail?spot_id=' + spot_id.toString()
              that.setData({
                shareData: shareData,
              })
            }
          })

        var markers = []
        _.each(spot_list, function(item) {
          if (item.id == spot_id) {
            var marker_item = {
              iconPath: "/image/icon_spots.png",
              id: item.id,
              latitude: item.latitude,
              longitude: item.longitude,
              width: 42,
              height: 42
            }
          } else {
            var marker_item = {
              iconPath: "/image/icon_spots_selected.png",
              id: item.id,
              latitude: item.latitude,
              longitude: item.longitude,
              width: 34,
              height: 34
            }
          }
          markers.push(marker_item)
        })

        that.setData({
          longitude: longitude,
          latitude: latitude,
          markers: markers
        })

        wx.hideNavigationBarLoading()
      }
    })
  }
})
