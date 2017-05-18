var app = getApp()

var _ = require( '../../libs/underscore-min.js' )


Page({
  data: {
    'markers': []
  },
  bindSpotViewTap: function(event) {
      wx.navigateTo({
        url: '../spot_detail/spot_detail?spot_id=' + event.currentTarget.id
      })
    },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    city_name = wx.getStorageSync('user_data').location
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var latitude = res.latitude
        var longitude = res.longitude

        if (city_name) {
          var request_url = "http://dangann.com/api/v1/city_spot_list/" + city_name + "/"
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
                spot_list_count: spot_list.length
              })

              var spot_id = spot_list[0].id
              var request_url = "http://dangann.com/api/v1/spots/" + spot_id.toString() + "/?format=json"
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
                var marker_item = {
                  iconPath: "/image/icon_spots_selected.png",
                  id: item.id,
                  latitude: item.latitude,
                  longitude: item.longitude,
                  width: 34,
                  height: 34
                }
                markers.push(marker_item)
              })

              that.setData({
                longitude: longitude,
                latitude: latitude,
                markers: markers
              })
            }
          })
        }
        else {
          that.setData({
            longitude: longitude,
            latitude: latitude,
            spot_list_count: 0
          })
        }
      }
    })
  },
})
