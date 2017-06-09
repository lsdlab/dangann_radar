var util = require('../../utils/util.js')
var _ = require( '../../libs/underscore-min.js' );

Page({
  data: {
    markers: [],
    spot_data: {},
    spot_name: '',
    spot_id: '',
    checked_text: '签到',
    controls: [{
        id: 1,
        iconPath: '/image/start_navi.png',
        position: {
          left: 15,
          top: 15,
          width: 100,
          height: 31
        },
        clickable: true
    }]
  },
  // 事件处理函数
  // 用户详情
  bindUserDetailViewTap: function(event) {
    wx.navigateTo({
      url: '../user_detail/user_detail?user_id=' + event.currentTarget.id
    })
  },
  // 查看全部评论
  bindAllCommentViewTap: function(event) {
    var spot_id = event.currentTarget.id.split('@')[0]
    var spot_name = event.currentTarget.id.split('@')[1]
    var spot_city = event.currentTarget.id.split('@')[2]
    wx.navigateTo({
      url: '../all_comment/all_comment?spot_id=' + spot_id + '&spot_name=' + spot_name + '&spot_city=' + spot_city
    })
  },
  // 提交评论
  bindCommentViewTap: function(event) {
    var spot_id = event.currentTarget.id.split('@')[0]
    var spot_name = event.currentTarget.id.split('@')[1]
    var spot_city = event.currentTarget.id.split('@')[2]
    wx.navigateTo({
      url: '../comment/comment?spot_id=' + spot_id + '&spot_name=' + spot_name + '&spot_city=' + spot_city
    })
  },
  // 签到
  bindCheckViewTap: function(event) {
    var that = this
    var spot_id = event.currentTarget.id.split('@')[0]
    var spot_name = event.currentTarget.id.split('@')[1]
    var spot_city = event.currentTarget.id.split('@')[2]

    var current_date = new Date()
    var current_date_string = current_date.getFullYear().toString() + current_date.getMonth().toString() + current_date.getDay().toString()
    var today_spot_checked_mark = spot_id.toString() + current_date_string + 'checked'
    if (wx.getStorageSync(today_spot_checked_mark) == '') {
      var check_request_url = "https://dangann.com/api/v1/comments/?format=json"
      wx.request({
        method: 'POST',
        data: {
           'spot_id': spot_id,
           'comment_message': '',
           'comment_user_id': wx.getStorageSync('user_data').id,
           'comment_user_name': wx.getStorageSync('user_data').username,
           'comment_user_avatarurl': wx.getStorageSync('userInfo').avatarUrl,
           'comment_mark': 'check',
           'spot_city': spot_city
        },
        url: check_request_url,
        header: {
          'content-type':'application/x-www-form-urlencoded',
          'Authorization': 'JWT ' + wx.getStorageSync('api_token')
        },
        success: function(res) {
          var check_data = res.data
          console.log('check_data')
          console.log(check_data)

          var current_date = new Date()
          var current_date_string = current_date.getFullYear().toString() + current_date.getMonth().toString() + current_date.getDay().toString()
          var today_spot_checked_mark = spot_id.toString() + current_date_string + 'checked'
          wx.setStorageSync(today_spot_checked_mark, 'checked')

          wx.showToast({
            title: '已签到',
            icon: 'success',
            duration: 2000
          });

          that.setData({
            checked_text: '已签到'
          })
        }
      })
    } else {
      wx.showToast({
        title: '今天已签到，请勿重复签到',
        icon: 'success',
        duration: 2000
      });
    }
  },
  controltap: function(e) {
    console.log(e.controlId)
    wx.openLocation({
      longitude: this.data.spot_data.longitude,
      latitude: this.data.spot_data.latitude,
      name: this.data.spot_data.name,
      address: this.data.spot_data.name
    })
  },
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    wx.showNavigationBarLoading()
    var spot_id = options.spot_id

    var current_date = new Date()
    var current_date_string = current_date.getFullYear().toString() + current_date.getMonth().toString() + current_date.getDay().toString()
    var today_spot_checked_mark = spot_id.toString() + current_date_string + 'checked'
    // var today_spot_commented_mark = spot_id.toString() + current_date_string + 'commented'

    // console.log(wx.getStorageSync(today_spot_checked_mark))
    // console.log(wx.getStorageSync(today_spot_commented_mark))

    if (wx.getStorageSync(today_spot_checked_mark) == 'checked') {
      that.setData({
        checked_text: '已签到'
      })
    }

    // if (wx.getStorageSync(today_spot_commented_mark) == 'commented') {
    //   that.setData({
    //     commented_or_not: 'commented'
    //   })
    // }

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

        var markers =  [{
          iconPath: "/image/location.png",
          id: 0,
          latitude: spot_data.latitude,
          longitude: spot_data.longitude,
          width: 40.5,
          height: 40.5
        }]

        that.setData({
          spot_name: spot_data.name,
          markers: markers
        })

        wx.setNavigationBarTitle({
          title: spot_data.name
        })
      }
    })

    var spot_comment_list_request_url = "https://dangann.com/api/v1/spot_comment_list/" + spot_id + "/?format=json"
    wx.request({
      url: spot_comment_list_request_url,
      header: {
          'content-type': 'application/json',
          'Authorization': 'JWT ' + wx.getStorageSync('api_token')
      },
      success: function(res) {
        var spot_comment_list = res.data
        if (_.isEmpty(spot_comment_list)) {
          spot_comment_list = '1'
        }
        that.setData({
          spot_comment_list: spot_comment_list
        })

        wx.hideNavigationBarLoading()
      }
    })
  },
  onShareAppMessage: function () {
    return this.data.shareData
  }
})
