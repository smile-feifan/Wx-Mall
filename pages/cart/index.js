import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 1.获取缓存中的收货地址
    const address = wx.getStorageSync('address');
    // 1.获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || [];
    // 1.计算全选
    // every数组方法 会遍历 会接受一个回调函数 那么 每一个回调函数都返回 true那么 every方法的返回值为true
    // 只要有一个回调函数返回了false 那么不再循环执行，直接返回 false
    // 空数组 调用 every,返回值就是true
    // const allchecked = cart.length ? every(v => v.checked) : false;
    this.setData({
      address
    });
    this.setCart(cart);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },
  // 点击收货地址 触发事件
  async handleChooseAdderss() {

    // 2.获取收货地址
    // wx.chooseAddress({
    //   success: (result) => {
    //     console.log(result);
    //   },
    // })
    // wx.getSetting({
    //   success: (result) => {
    //     console.log(result);
    //   }
    // })
    // 1.获取  权限状态
    // wx.getSetting({
    //   success: (result) => {
    //     // 获取权限状态  只要发现一些属性名很怪异的时候 都要使用 [""]形式来获取属性值
    //     const scopeAddress = result.authSetting["scope.address"];
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //       wx.chooseAddress({
    //         success: (result1) => {
    //           console.log(result1)
    //         },
    //       })
    //     } else {
    //       // 3.用户 以前拒绝过授予权限  先诱导用户打开授权界面
    //       wx.openSetting({
    //         success: (result) => {
    //           // 4.可以调用  获取收货地址代码
    //           wx.chooseAddress({
    //             success: (result3) => {
    //               console.log(result3)
    //             },
    //           })
    //         },
    //       })
    //     }
    //   }
    // })

    // 1.获取权限状态
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2.判断权限的状态
      if (scopeAddress === false) {
        // 3.调用获取收货地址的api
        await openSetting();
      }
      // 4.调用获取到的收货地址 api
      const address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 5.将收货地址存入缓存
      wx.setStorageSync("address", address)

    } catch (error) {
      console.log(error);
    }


  },
  // 复选框 点击商品被选中
  handleItemChange(e) {
    // 1.获取被修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 2.获取购物车数组
    let {
      cart
    } = this.data;
    // 3.找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4.选中状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 设置购物车状态的同时 重新计算 底部工具栏的数据 全选 总价格 购买的数量
  setCart(cart) {
    let allChecked = true;
    // 总价格和总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    })
    // 判断数组是否为空
    allChecked = cart.lengtn != 0 ? allChecked : false;

    // 5 6 .把购物车的数据重新设置回data中和缓存中
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    });
    wx.setStorageSync('cart', cart);
  },
  // 商品的全选功能
  handleItemAllCheck() {
    //  1.获取data中的数据
    let {
      cart,
      allChecked
    } = this.data;
    // 修改值
    allChecked = !allChecked;
    // 3.循环修改cart数组  中的商品选中状态
    cart.forEach(v => v.checked = allChecked);
    // 4.把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑功能
  async handleItemNumEdit(e) {
    // 1.获取传递过来 的参数
    const {
      operation,
      id,
    } = e.currentTarget.dataset
    // 2.找到需要修改的商品索引
    let {
      cart
    } = this.data;
    // 3.找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id === id);
    // 4.判断是否要执行修改数量
    if (cart[index].num === 1 && operation === -1) {
      // 4.1弹窗提示
      const res = await showModal({
        content: '您是否要删除?'
      });
      console.log(res);
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      // 4.进行数量修改
      cart[index].num += operation;
      // 5设置回缓存和data中
      this.setData({
        cart
      });

    }

  },
  // 点击结算
  async handlePay() {
    // 1.判断收货地址
    const {
      address,
      totalNum
    } = this.data;
    if (!address.userName) {
      await showToast({
        title: "您还没有选择收货地址"
      });
      return;
    } else
      // 2.判断用户有没有选购商品
      if (totalNum === 0) {
        await showToast({
          title: "您还没有选购商品"
        });
        return;
      }
    // 3.跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    })
  }
})