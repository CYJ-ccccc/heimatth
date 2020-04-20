<template>
  <div class="main" ref="main">
    <!-- 头部搜索框区域 -->
    <van-search shape="round" background="#4fc08d" placeholder="请输入搜索关键词" @click="openSearch" />
    <!-- 频道区域 -->
    <van-tabs v-model="active">
      <van-tab v-for="(item,index) in channels" :title="item.name" :key="index">
        <!-- 文章区域下拉刷新 -->
        <van-pull-refresh v-model="item.isLoading" @refresh="onRefresh" class="pullRefresh">
          <van-list v-model="item.loading" :finished="item.finished" finished-text="没有更多了" @load="onLoad" ref="vanList" class="list">
            <van-cell v-for="(item2,index2) in item.articlelist" :key="index2" @click="onDetail(item2)">
              <h3 class="articleTitle">{{item2.title}}</h3>
              <!-- 中间图片区域 -->
              <van-grid :border="false" v-if="item2.cover.type!=0">
                <van-grid-item v-for="(imgItem,imgIndex) in item2.cover.images" :key="imgIndex">
                  <van-image :src="imgItem" lazy-load />
                </van-grid-item>
              </van-grid>
              <!-- 详情信息区域 -->
              <div class="articleInfo">
                <div class="articleInfo_left">
                  <span class="auther">{{item2.aut_name}}</span>
                  <span class="comment">{{item2.comm_count}} 评论</span>
                  <span class="create_date">{{item2.pubdate|timeFilter}}</span>
                </div>
                <div class="articleInfo_right">
                  <van-icon name="cross" @click="openMore(item2.art_id,item2.aut_id)" />
                </div>
              </div>
            </van-cell>
            <!-- <van-cell v-for="(item2,index2) in item.articlelist" :key="index2" :title="item2.title" /> -->
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 频道弹出控件 -->
    <van-icon name="qr" @click="showPopup" />
    <!-- 频道弹出区域 -->
    <!-- 利用vue中.sync双向绑定方法绑定父子组件值得双向绑定 -->
    <Channel :channels="channels" :active.sync="active" ref="Channel"></Channel>
    <!-- 更多操作弹出控件 -->
    <More ref="More" :moreId="moreId" :authorId="authorId"></More>
  </div>
</template>
<script>
// 导入   获取频道          获取文章           对文章不感兴趣的方法
import { getChannelsApi, getActicleApi, dislikeArtApi } from '../../api/index'
// 导入频道弹出组件
import Channel from './components/channel'
// 导入更多操作组件
import More from './components/more'
// 导入图片懒加载
import Vue from 'vue'
import { Lazyload } from 'vant'
// 使用图片懒加载
Vue.use(Lazyload)
export default {
  props: ['footerTop'],
  data () {
    return {
      // 搜索框的值
      value: '',
      // 频道数据
      channels: [],
      // 当前点击频道index
      active: 0,
      // 当前点击更多操作的文章id
      moreId: 0,
      // 当前点击更多操作的作者id
      authorId: 0,
      // 不喜欢文章的id
      dislikeId: 0
    }
  },
  components: {
    Channel,
    More
  },
  methods: {
    // 封装获取频道的方法
    async getChannel () {
      try {
        if (this.$isLogin()) { // 已登录
          var res = await getChannelsApi()
          // window.console.log(res)
          this.channels = res.data.data.channels
          // window.console.log(this.channels)
        } else { // 未登录
          // 如果没有登录，就从本地里取频道值
          var channel = JSON.parse(window.localStorage.getItem('Channels'))
          if (channel) { // 如果本地存在频道
            this.channels = channel
          } else { // 如果本地不存在频道
            var result = await getChannelsApi()
            this.channels = result.data.data.channels
            // 并保存在本地
            window.localStorage.setItem('Channels', JSON.stringify(result.data.data.channels))
          }
        }
      } catch {
        this.$toast.fail('获取频道失败!请重新登录试试！')
      }
      this.addChannelProps()
    },
    // 进入文章详情页
    onDetail (item) {
      // window.console.log(item)
      this.$router.push(`/detail?id=${item.art_id}`)
    },
    // 滚动刷新数据
    async onLoad () {
      // 得到当前频道
      var currenChannel = this.channels[this.active]
      // window.console.log(currenChannel.articlelist)
      // 得到当前频道的id
      var id = currenChannel.id
      // window.console.log(id)
      try {
        // 根据id发送网络请求得到数据
        var res = await getActicleApi({
          channel_id: id,
          timestamp: Date.now(),
          with_top: 1
        })
        // window.console.log(res)
        // 把获取的文章列表保存下来articlelist
        // 判断返回来的数据是否存在
        if (res.data.data.results.length !== 0) {
          currenChannel.articlelist = [...currenChannel.articlelist, ...res.data.data.results]
          // window.console.log(this.channels)
        } else {
          // 返回来的文章不存在就启动finished属性
          currenChannel.finished = true
        }
        currenChannel.loading = false
      } catch {
        this.$toast.fail('获取文章失败！请重试')
      }
    },
    // 下拉刷新
    onRefresh () {
      // 得到当前频道
      var currenChannel = this.channels[this.active]
      // 将当前频道所有数据清除
      currenChannel.articlelist = []
      currenChannel.loading = false
      currenChannel.finished = false
      currenChannel.isLoading = false
      // 重新加载
      this.onLoad()
      // 再次加载撑开进度条
      this.onLoad()
    },
    // 给频道数据源中添加其他属性
    addChannelProps () {
      this.channels.forEach(item => {
        // 给频道数据源每个频道添加articlelist，loading，finished，isLoading
        this.$set(item, 'articlelist', [])
        this.$set(item, 'loading', false)
        this.$set(item, 'finished', false)
        this.$set(item, 'isLoading', false)
      })
    },
    // 频道弹出面板点击事件
    showPopup () {
      this.$refs.Channel.show = true
    },
    // 更多弹出面板点击事件
    openMore (moreId, authorId) {
      // 显示更多页
      this.$refs.More.show = true
      // window.console.log(moreId)
      this.moreId = moreId
      this.authorId = authorId
      // window.console.log(this.authorId)
    },
    // 根据子组件传过来的id，删除文章
    async deleteArt (id) {
      // 根据传进来的id找出该文章
      this.channels[this.active].articlelist.forEach((item, index) => {
        if (item.art_id === id) {
          this.channels[this.active].articlelist.splice(index, 1)
        }
      })
      // 发送网络请求
      try {
        var res = await dislikeArtApi({ target: id })
        window.console.log(res)
        if (res.status === 201) {
          this.$toast.success('标记成功')
        }
        // if(res)
      } catch {
        this.$toast.fail('标记失败')
      }
    },
    // 打开搜索框页面
    openSearch () {
      this.$router.push('/search')
    }
  },
  created () {
    this.getChannel()
    // 得到list列表的高度
  },
  mounted () {
    // var listHeight = this.footerTop - 94
    var obj = this.$refs.vanList
    window.console.log(obj)
    // obj.style.height = listHeight
  }
}
</script>
<style lang="less" scope>
.main {
  // margin-top: 95px;
  margin-bottom: 50px;

  .van-search {
    position: fixed;
    z-index: 1;
    width: 100%;
    top: 0;
    left: 0;
  }
  .van-tabs {
    width: 100%;
    .van-tabs__wrap.van-hairline--top-bottom {
      // margin-top: 54px;
      position: fixed;
      z-index: 1;
      width: 100%;
      top: 54px;
      left: 0;
      border-bottom: 1px solid rgb(163, 167, 158);
    }
    .pullRefresh {
      margin-top: 94px;

      .list {
        width: 100%;
        position: fixed;
        bottom: 50px;
        top: 94px;
        overflow: scroll;
      }
      .van-cell:not(:last-child)::after {
        border-bottom: 1px solid rgb(211, 216, 205);
      }
      .articleInfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #bbb;
        font-size: 12px;

        .articleInfo_left {
          span {
            margin-right: 10px;
          }
        }
        .articleInfo_right {
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      }
    }
  }
}
.van-icon.van-icon-qr {
  background-color: rgb(192, 228, 212);
  font-size: 30px;
  position: fixed;
  z-index: 1;
  top: 62px;
  right: 4px;
  color: #323233;
}
</style>
