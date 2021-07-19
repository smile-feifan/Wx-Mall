import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    tabs: [{
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "待发货",
        isActive: false
      },
      {
        id: 3,
        value: "退货/退款",
        isActive: false
      }
    ]

  },
  // 根据标题索引来激活选中 标题数组
  changeTitleByIndex(index) {
    // 2.修改源数组
    let {
      tabs
    } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    // console.log(e);

    const {
      index
    } = e.detail;
    // 1.获取被点击的标题索引
    this.changeTitleByIndex(index);
    // 2.重新发送请求
    this.getOrders(index + 1);
  },
  onShow(option) {
    // 判断缓存中是否存在token值
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/quth/index',
      });
      return;
    }
    // 在onShow里面是不能获取到option,只有在onLoad中才有
    // console.log(option); //undefined
    // 1.获取当前的小程序的页面栈-数组 长度最大的就是当前页面
    let pages = getCurrentPages();
    // console.log(pages);
    let currentPage = pages[pages.length - 1];
    // console.log(pages);
    // console.log(currentPage.options);
    // 3.获取url中的type参数
    const {
      type
    } = currentPage.options;
    // 激活选中页面标题 (当type值为1时  index值为0)
    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
    // console.log(type);
  },
  // 获取订单列表的方法
  async getOrders(type) {
    const res = await request({
      url: "/my/orders/all",
      data: {
        type
      }
    });
    this.setData({
      orders: res.orders.map(v => ({
        ...v,
        create_time_cn: (new Date(v.create_time * 1000).toLocaleString())
      }))
    })
  }

})