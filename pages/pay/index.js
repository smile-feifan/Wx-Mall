import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {
  request
} from "../../request/index.js"
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1.获取缓存中的收货地址
    const address = wx.getStorageSync('address');
    // 1.获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    // 1.计算全选
    // every数组方法 会遍历 会接受一个回调函数 那么 每一个回调函数都返回 true那么 every方法的返回值为true
    // 只要有一个回调函数返回了false 那么不再循环执行，直接返回 false
    // 空数组 调用 every,返回值就是true
    // const allchecked = cart.length ? every(v => v.checked) : false;
    this.setData({
      address
    });

    // 总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    })
    // 5 6 .把购物车的数据重新设置回data中和缓存中
    this.setData({
      cart,
      totalNum,
      totalPrice,
      address
    });
    wx.setStorageSync('cart', cart);
  },
  // 点击支付
  async handleOrderPay() {
    try {
      // 1.先判断有没有token 值
      const token = wx.getStorageSync("token");
      // 2.判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/quth/index',
        });
        return;
      }
      console.log("已经存在token，进行下一步操作");
      // 3.创建订单
      // 3.1准备 请求头参数
      // const header = {
      //   Authorization: token
      // };
      // 3.2准备 请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.goods_number,
        goods_price: v.goods_price
      }));
      const orderParams = {
        order_price,
        consignee_addr,
        goods
      };
      // 4.准备发送请求，创建订单 获取订单编号
      const {
        order_number
      } = await request({
        url: "/my/orders/create",
        method: "post",
        data: orderParams,
        // header: header
      })
      console.log(order_number);
      // 5.发起 预支付接口
      const {
        pay
      } = await request({
        url: "/my/orders/req_unifiedorder",
        method: "post",
        // header,
        data: {
          order_number
        }
      })
      //  6.发起微信支付
      const res = await requestPayment(pay);
      // console.log(res);
      // 7.查询后台订单状态
      // const res = await request({
      //   url: "/my/orders/chkOrder",
      //   method: "post",
      //   header,
      //   data: {
      //     order_number
      //   }
      // })
      // 8.手动删除缓存中已经支付过了的商品
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync('cart', newCart);
      // 8.支付成功跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index/',
      })

      await showToast({
        title: "支付成功"
      })
      // 
    } catch (error) {
      console.log(error);
      await showToast({
        title: "支付失败"
      });
    };
  }
})