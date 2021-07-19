// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径 数组
    chooseImgs: [],
    // 文本域的内容
    textVal: ""
  },
  // 外网的图片路径数组
  upLoadImgs: [],
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
  // 点击 + 按钮
  handleChooseImg(e) {
    // 2.调用小程序内置的选择图片 api
    wx.chooseImage({
      // 同时选中的图片的数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        // console.log(result);
        this.setData({
          // （不能直接重置数组）需要对图片数组进行拼接
          // chooseImgs: result.tempFilePaths
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    })
  },
  // 点击图片删除
  handleRemoveImg(e) {
    // console.log(e);
    // 2获取被点击的数组的索引
    const {
      index
    } = e.currentTarget.dataset;
    // console.log(index);
    // 3.获取data中的图片数组
    let {
      chooseImgs
    } = this.data;
    // 4.删除元素
    chooseImgs.splice(index, 1)
    this.setData({
      chooseImgs
    })
  },
  // 文本域的输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  // 提交按钮的点击
  handleFormSubmit(e) {
    // 1.获取文本域的内容 图片数组
    const {
      textVal,
      chooseImgs
    } = this.data;
    // 2.合法性验证
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    // 3.准备上传图片到专门的图片服务器
    // 上传文件的 api不支持 多个文件同时上传   遍历数组 挨个上传
    // 显示一个正在等待的图片
    wx.showLoading({
      title: '正在等待',
      mask: true
    })
    chooseImgs.forEach((v, i) => {
      wx.uploadFile({
        // 被上传的文件的路径
        filePath: 'v',
        // 上传的文件名称 后台来获取文件 file
        name: 'file',
        // 表示图片要上传到哪里
        url: 'https://imgurl.org/',
        // 顺带的 文本信息
        formData: {},
        success: (result) => {
          // console.log(result);
          console.log(result);
        },
        fail: (error) => {
          console.log(error);
          wx.navigateBack({
            delta: 1,
          })
        }
      });
    })
  }
})