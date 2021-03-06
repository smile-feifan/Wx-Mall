import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query || "";
    this.getGoodsList();
  },
  // 标题点击事件 从子组件传递过来的
  handleTabsItemChange(e) {
    // console.log(e);
    // 1.获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 2.修改源数组
    let {
      tabs
    } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  // 获取商品事件
  async getGoodsList() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams,
    });
    // console.log(res);
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    // console.log(this.totalPages);
    this.setData({
      // goodsList:res.goods
      // 拼接了数组
      goodsList: [...this.data.goodsList, ...res.goods]
    });
    // 关闭下拉刷新的窗口 如果没有调用 下拉加载刷新窗口 直接关闭也不会报错
    wx.stopPullDownRefresh()

  },

  // 页面上滑 滚动条触底事件
  onReachBottom() {
    // console.log("111");
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据
      wx.showToast({
        title: '没有下一页数据了',
      })
      // console.log('%c'+"没有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right ,skyblue,pink)")
    } else {
      // 还有下一页数据
      // console.log('%c'+"还有下一页数据","color:red;font-size:100px;background-image:linear-gradient(to right ,skyblue,pink)")
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }

  },
  // 下拉刷新事件
  onPullDownRefresh() {
    //  1.重置数组
    this.setData({
        goodsList: []
      }),
      // 重置页码
      this.QueryParams.pagenum = 1;
    // 重新发送请求
    this.getGoodsList()
  }

})