import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 商品是否被收藏过
    isCollect: false
  },
  // 商品对象
  GoodsInfo: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;
    const {
      goods_id
    } = options;
    this.getGoodsDetail(goods_id);
  },
  // 获取商品的详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: {
        goods_id
      }
    });
    this.GoodsInfo = goodsObj;
    console.log(this.GoodsInfo);
    // 1.获取商品详情数据的数组
    let collect = wx.getStorageSync('collect') || [];
    // 2. 判断一下当前商品是否被收藏了
    // some函数遍历，如果不满足，则为false
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 点击轮播图 放大预览
  handlePrevewImage(e) {
    // 1.先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    // 接收传递过来的url
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  // 点击 加入购物车
  handleCartAdd(e) {
    // 1.获取缓存中的购物车 数组
    let cart = wx.getStorageSync('cart') || [];
    // 2.判断商品数组是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 3不存在
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;

      cart.push(this.GoodsInfo)
    } else {
      // 4已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    // 5.把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    // 6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // 防止用户 手抖 疯狂点击 
      mask: true
    });
  },

  // collect点击事件
  handleCollect(e) {
    let isCollect = false;
    //  1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || [];
    //  2.判断该商品是否被收藏过
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    //  3.当index!=-1表示已经收藏过
    if (index !== -1) {
      // 能找到 已经收藏过了  在数组中删除该商品
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      })
    } else {
      // 没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    // 4.把数组存入到缓存中
    wx.setStorageSync('collect', collect);
    // 5.修改data中的属性 isCollect
    this.setData({
      isCollect
    })

  }

})