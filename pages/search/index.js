import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods: [],
    // 取消 按钮 是否显示
    isFocus: false,
    // 输入框的值
    inputValue: ""
  },
  TimeId: -1,
  handleInput(e) {
    // console.log(e);
    // 1.获取输入框的值
    const {
      value
    } = e.detail;
    // 2.检测合法性
    if (!value.trim()) {
      this.setData({
        isFocus: false
      })
      return;
    }
    // 3.准备发送请求获取数据
    this.setData({
      isFocus: true
    })
    clearTimeout(this.TimeId);
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);

  },
  // 发送请求获取搜索建议数据
  async qsearch(query) {
    const res = await request({
      url: "/goods/qsearch",
      data: {
        query
      }
    })
    // console.log(res);
    this.setData({
      goods: res
    })
  },
  // 点击 取消按钮
  handleConcel(e) {
    this.setData({
      inputValue: "",
      isFocus: false,
      goods: []
    })
  }

})