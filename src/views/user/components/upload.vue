<template>
  <div class="upload">
    <van-popup v-model="show" position="bottom" :close-on-click-overlay="false">
      <div class="take_photo item">拍照</div>
      <div class="select_photo item" @click="openFile">从相册选择</div>
      <div><input type="file" @change="changeIcon" class="myfile" style="display:none" ref="myfile"></div>
      <div class="cancel item" @click="cancel">取消</div>
    </van-popup>
  </div>
</template>

<script>
// 导入图片修改的网络请求
import { reviseUserIconApi } from '../../../api/user'
// 注册上传组件
import Vue from 'vue'
import { ImagePreview } from 'vant'
// 全局注册
Vue.use(ImagePreview)
export default {
  data () {
    return {
      show: false
    }
  },
  methods: {
    // 隐藏弹出层
    cancel () {
      this.show = false
    },
    // 打开图片选择器
    openFile () {
      this.$refs.myfile.click()
    },
    // 选中图片的改变事件
    changeIcon () {
      // 得到选择的图片
      var file = this.$refs.myfile.files[0]
      // window.console.log(file)
      // 创建一个fileReader对象
      var reader = new FileReader()
      // 调用方法进行转换
      reader.readAsDataURL(file)
      // 接收转换后的结果,并执行函数
      reader.addEventListener('load', () => {
        // 获取图片路径
        var path = reader.result
        // 完成图片预览
        ImagePreview({
          images: [path],
          // 预览框的关闭事件
          onClose: this.closePreview
        })
      })
    },
    // 预览框的关闭事件
    closePreview () {
      // 关闭上传面板
      this.show = false
      // 关闭预览给出提示
      this.$dialog.confirm({
        title: '提示',
        message: '你确定要保存图片设置'
      })
        .then(async () => {
          // 得到选择的图片
          var file = this.$refs.myfile.files[0]
          var res = await reviseUserIconApi(file)
          window.console.log(res)
          var photo = res.data.data.photo
          // 将此图片传递给父组件
          this.$emit('changeIcon', photo)
        })
        .catch(() => {
          this.$toast('已取消')
        })
    }
  }
}
</script>

<style lang="less">
.upload {
  .van-popup {
    text-align: center;
    background-color: #eee;

    .item {
      width: 100%;
      height: 50px;
      line-height: 50px;
      background-color: #fff;
    }
    .take_photo,
    .select_photo {
      border-bottom: 1px solid #eee;
    }
    .cancel {
      margin-top: 8px;
    }
  }
}
</style>
