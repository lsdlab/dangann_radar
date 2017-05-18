var util = require('../../utils/util.js')
var _ = require( '../../libs/underscore-min.js' )

var app = getApp()

var sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置

Page({
    shareData: {
      title: '单干小雷达',
      desc: '分享适合办公的咖啡馆',
      path: '/pages/index/index'
    },
    data: {
        list: [
          {alphabet: 'Top', datas: []},
          {alphabet: 'B', datas: ['北京']},
          {alphabet: 'G', datas: ['广州', '贵阳']},
          {alphabet: 'H', datas: ['杭州']},
          {alphabet: 'N', datas: ['南京']},
          {alphabet: 'S', datas: ['上海','深圳', '苏州']},
          {alphabet: 'W', datas: ['武汉']},
        ],
        alpha: '',
        windowHeight: '',
        tabs: ["动态", "城市", "我"],
        activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
        userInfo: {},
        user_comment_list: 1,
        user_spot_list: 1
    },
    //事件处理函数
    bindCityViewTap: function(event) {
      var city_name = event.target.id
      // wx.navigateTo({
      //   url: '../city/city?city_name=' + city_name
      // })

      wx.navigateTo({
        url: '../city_map/city_map?city_name=' + city_name
      })
    },
    // bindLogViewTap: function() {
    //   wx.navigateTo({
    //     url: '../logs/logs'
    //   })
    // },
    bindNewViewTap: function() {
      wx.navigateTo({
        url: '../new/new'
      })
    },
    bindNearViewTap: function() {
       wx.navigateTo({
        url: '../near/near'
      })
    },
    bindSpotViewTap: function(event) {
      wx.navigateTo({
        url: '../spot_detail/spot_detail?spot_id=' + event.currentTarget.id
      })
    },
    bindProfileViewTap: function(event) {
      wx.navigateTo({
        url: '../profile/profile'
      })
    },
    bindUserDetailViewTap: function(event) {
      wx.navigateTo({
        url: '../user_detail/user_detail?user_id=' + event.currentTarget.id
      })
    },
    onLoad: function () {
      console.log('onLoad')
      var that = this

      app.getUserInfo(function(userInfo){
        console.log('userInfo')
        console.log(userInfo)

        that.setData({
          userInfo:userInfo
        })

        wx.setStorageSync('userInfo', userInfo)

        function getUserCommentList(user_data) {
          var user_comment_list_request_url = "http://dangann.com/api/v1/user_comment_list/" + user_data.id + "/?format=json"
          wx.request({
            url: user_comment_list_request_url,
            header: {
              'content-type': 'application/json',
              'Authorization': 'JWT ' + wx.getStorageSync('api_token')
            },
            success: function(res) {
              var user_comment_list = res.data
              if (_.isEmpty(user_comment_list)) {
                user_comment_list = '1'
              }
              that.setData({
                user_comment_list: user_comment_list
              })
            }
          })
        }

        function getUserSpotList(user_data) {
          var user_comment_list_request_url = "http://dangann.com/api/v1/user_spot_list/" + user_data.id + "/?format=json"
          wx.request({
            url: user_comment_list_request_url,
            header: {
              'content-type': 'application/json',
              'Authorization': 'JWT ' + wx.getStorageSync('api_token')
            },
            success: function(res) {
              var user_spot_list = res.data
              if (_.isEmpty(user_spot_list)) {
                user_spot_list = '1'
              }
              that.setData({
                user_spot_list: user_spot_list
              })
            }
          })
        }

        function get_RandomSpotList() {
          var random_spot_list = "http://dangann.com/api/v1/random_spots/?format=json"
          wx.request({
            url: random_spot_list,
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
            }
          })
        }

        function get_LatestCommentsList() {
          var latest_comments_list = "http://dangann.com/api/v1/latest_comments/?format=json"
          wx.request({
            url: latest_comments_list,
            header: {
              'content-type': 'application/json',
              'Authorization': 'JWT ' + wx.getStorageSync('api_token')
            },
            success: function(res) {
              var comments_list = res.data
              that.setData({
                comments_list: comments_list,
                comments_list_count: comments_list.length
              })
            }
          })
        }

        function get_api_token() {
          var api_token_request_url = "http://dangann.com/api/v1/api-token-auth/?format=json"
          wx.request({
            method: 'POST',
            data: {
               'username': 'api_user_for_weixin',
               'password': '1234%^&*'
            },
            url: api_token_request_url,
            success: function(res) {
              var token_data = res.data
              wx.setStorageSync('api_token', token_data['token'])
            }
          })
        }

        get_api_token()
        var nickname = userInfo['nickName']
        var avatarurl = userInfo['avatarUrl']
        var check_user_request_url = "http://dangann.com/api/v1/check_user/" + nickname + "/?format=json"
        wx.request({
          url: check_user_request_url,
          header: {
            'content-type': 'application/json',
            'Authorization': 'JWT ' + wx.getStorageSync('api_token')
          },
          success: function(res) {
            if (_.isEmpty(res.data)) {
              var create_user_request_url = "http://dangann.com/api/v1/create_weixin_user/?format=json"
              wx.request({
                method: 'POST',
                data: {
                   'weixin_nickName': nickname,
                   'weixin_avatarUrl': avatarurl
                },
                url: create_user_request_url,
                header: {
                  'content-type':'application/x-www-form-urlencoded',
                  'Authorization': 'JWT ' + wx.getStorageSync('api_token')
                },
                success: function(res) {
                  var user_data = res.data
                  console.log('user_data')
                  console.log(user_data)
                  wx.setStorageSync('user_data', user_data)


                  if (user_data['location'] == '') {
                    wx.navigateTo({
                      url: '../profile/profile'
                    })
                    wx.showToast({
                      title: '请输入常住城市',
                      icon: 'info',
                      duration: 2000
                    });
                  } else {
                    getUserCommentList(user_data)
                    getUserSpotList(user_data)
                    get_LatestCommentsList()
                    get_RandomSpotList()
                  }
                }
              })
            } else {
              var user_data = res.data
              console.log('user_data')
              console.log(user_data)
              wx.setStorageSync('user_data', user_data)

              if (user_data['location'] == '') {
                wx.navigateTo({
                  url: '../profile/profile'
                })
              } else {
                getUserCommentList(user_data)
                getUserSpotList(user_data)
                get_LatestCommentsList()
                get_RandomSpotList()
              }
            }
          }
        })
      })

      wx.getSystemInfo({
          success: function(res) {
              that.setData({
                  sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                  sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
              })
          }
      })

      try {
        var res = wx.getSystemInfoSync()
        this.pixelRatio = res.pixelRatio
        // this.apHeight = 32 / this.pixelRatio
        // this.offsetTop = 160 / this.pixelRatio
        this.apHeight = 16
        this.offsetTop = 80
        this.setData({windowHeight: res.windowHeight + 'px'})
      } catch (e) {

      }
    },
    tabClick: function (e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        })
    },
    handlerAlphaTap(e) {
      let {ap} = e.target.dataset
      this.setData({alpha: ap})
    },
    handlerMove(e) {
      let {list} = this.data
      let moveY = e.touches[0].clientY
      let rY = moveY - this.offsetTop
      if(rY >= 0) {
        let index = Math.ceil((rY - this.apHeight)/ this.apHeight)
        if(0 <= index < list.length) {
          let nonwAp = list[index]
          nonwAp && this.setData({alpha: nonwAp.alphabet})
        }
      }
    },
    onShareAppMessage: function () {
      return this.data.shareData
    }
})


