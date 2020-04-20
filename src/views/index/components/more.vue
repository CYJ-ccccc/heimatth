<template>
  <div class="more">
    <!-- 更多操作详情 -->
    <van-popup v-model="show">
      <van-cell title="不感兴趣" icon="close" label="减少这类内容" @click="dislike()">
      </van-cell>
      <van-cell title="举报" icon="warning-o" is-link label="标题夸张、内容质量差 等" @click="openReport">
      </van-cell>
      <van-cell title="拉黑作者" icon="down" label="作者低俗、无聊 等" @click="blicked">
      </van-cell>
      <van-cell icon="location-o">
        <template #title>
          <div>
            {{moreId}}
          </div>
        </template>
      </van-cell>
    </van-popup>
    <!-- 举报内容详情 -->
    <van-popup v-model="isShow">
      <van-nav-bar title="举报" left-text="返回" left-arrow @click-left="onClickLeft" />
      <van-cell :title="item.content" v-for="(item,index) in reportType" :key="index" @click="submitReport(item.id)">
      </van-cell>
    </van-popup>
  </div>
</template>

<script>
// 导入举报文章的网络请求
import { artReportsApi, blackedApi } from '../../../api/index'
export default {
  props: ['moreId', 'authorId'],
  data () {
    return {
      show: false,
      // 举报文章控件
      isShow: false,
      // 举报文章类型
      reportType: [
        { id: 0, content: '其他问题' },
        { id: 1, content: '标题夸张' },
        { id: 2, content: '低俗色情' },
        { id: 3, content: '错别字多' },
        { id: 4, content: '旧闻重复' },
        { id: 5, content: '广告软文' },
        { id: 6, content: '内容不实' },
        { id: 7, content: '涉嫌违法犯罪' },
        { id: 8, content: '侵权' }]
    }
  },
  methods: {
    // 对文章标记不喜欢
    dislike () {
      // this.$emit('dislikeId', this.moreId)
      this.$parent.deleteArt(this.moreId)
      this.show = false
    },
    // 打开举报详情页
    openReport () {
      // 隐藏更多列表框
      this.show = false
      // 显示举报详情页
      this.isShow = true
    },
    // 举报页返回事件
    onClickLeft () {
      // 隐藏举报详情页
      this.show = true
      // 显示更多列表框
      this.isShow = false
    },
    // 举报文章
    async submitReport (id) {
      try {
        await artReportsApi({
          type: id,
          target: this.moreId
        })
        this.$toast.success('举报成功!')
        // 隐藏举报详情页
        this.isShow = false
        // 隐藏更多列表框
        this.Show = false
      } catch {
        this.$toast.fail('举报失败')
      }
    },
    // 拉黑作者
    async blicked () {
      try {
        await blackedApi({
          target: this.authorId
        })
        this.$toast.fail('拉黑成功!可在用户操作区域还原!')
        // 隐藏更多列表框
        this.show = false
      } catch (error) {
        this.$toast.fail('拉黑失败')
      }
    }
  }
}
</script>

<style lang="less" scope>
.van-popup.van-popup--center {
  border-radius: 6px;
  width: 80%;
  .van-cell {
    display: flex;
    align-items: center;
  }
  .van-nav-bar {
    .van-nav-bar__left {
      .van-nav-bar__text,
      .van-icon {
        color: #000;
      }
    }
  }
}
</style>
