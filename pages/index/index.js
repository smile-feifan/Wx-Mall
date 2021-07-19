import {
  request
} from "../../request/index.js"
wx - Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.发送异步请求获取轮播图数据 
    // 2.优化 通过es6的promise来解决这个问题
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   // enableCache: true,
    //   // enableHttp2: true,
    //   // enableQuic: true,
    //   success: (result) => {
    //     console.log(result);
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //   },
    // })
    // request({
    //   url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata"
    // }).then(result => {
    //   this.setData({
    //     swiperList: result.data.message
    //   })
    // })
    this.getSwiperList();
    this.getCatesList();
    this.getFloorList()
  },
  // 获取轮播图数据
  getSwiperList() {
    request({
      url: "/home/swiperdata"
    }).then(res => {
      this.setData({
        swiperList: res
      })
    })
  },
  // 获取分类导航数据
  getCatesList() {
    request({
      url: "/home/catitems"
    }).then(result => {
      this.setData({
        catesList: result
      })
    })
  },
  // 获取楼层数据
  getFloorList() {
    request({
      url: "/home/floordata"
    }).then(res => {
      this.setData({
        floorList: res
      })
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})