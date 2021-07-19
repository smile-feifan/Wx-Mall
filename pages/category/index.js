import {
  request
} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: -1
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
    0.web中的本地存储和小程序中的本地存储区别
      1.写代码的方式不一样了
        web:localStorage.setItem('key','value') locaStorage.getItem("key")
        小程序：wxwx.setStorageSync('key', data);wx.getStorageSync('key')
      2. 存的时候有没有做类型转换
        web:不管存入的是什么类型的数据 最终都会先调用一下 toString(),把数据变成了字符串 再存入进去
        小程序：不存在 类型转换这个操作 存什么类型的数据进去，获取的就是什么类型
    1.先判断一下本地存储中有没有旧的数据
      {time:Date.now(),data:[...]}
    2.没有旧的数据 直接发送请求
    3.有旧的数据，同时旧的数据也没有过期 就使用本地存储中的旧数据即可
    */
    //  1.获取本地存储数据(小程序中也是存在本地存储技术的)
    const Cates = wx.getStorageSync("cates");
    // 2.判断
    if (!Cates) {
      // 不存在 发送请求数据
      this.getCates();
    } else {
      // 有旧数据定义过期时间 10s 改成5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        // console.log('可以使用旧数据')
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        });
      }

    }
  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url:"/categories"
    // })
    // .then(res=>{
    //   // console.log(res);
    //   // 把接口的数据存入到本存储中
    //   wx.setStorageSync('cates',{time:Date.now(),data:this.Cates});
    //   this.Cates=res.data.message;
    //   // 构造左侧的大菜单数据
    //   let leftMenuList=this.Cates.map(v=>v.cat_name);
    //   // 构造右侧的商品数据
    //   let rightContent=this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   });
    // })

    // 使用es7的async await来发送请求
    const res = await request({
      url: "/categories"
    });
    this.Cates = res;
    // 构造左侧的大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧的商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    });

  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // 点击事件被触发后获取被点击的标题的索引
    console.log(e)
    // 1.获取被点击的标题身上的索引
    // 2.给data中的currentIndex赋值
    const {
      index
    } = e.currentTarget.dataset;

    let rightContent = this.Cates[index].children;
    // 重新设置右侧内容的scroll-view标签距离顶部的距离
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })

  }

})