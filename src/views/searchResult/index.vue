<template>
  <div class="searchResult_wrap">
    <van-search v-model="value" shape="round" show-action background="#4fc08d" placeholder="请输入搜索关键词" @cancel="onCancel" @click="openSearch" />
    <!-- 频道区域 -->
    <van-tabs>
      <van-tab title="综合">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list v-model="loading" finished-text="没有更多了" @load="onLoad">
            <van-cell v-for="(item,index) in articlelist" :key="index" @click="toDetail(item)">
              <h3 class="articleTitle" v-html="item.title"></h3>
              <!-- 中间图片区域 -->
              <van-grid :border="false" v-if="item.cover.type!=0">
                <van-grid-item v-for="(imgItem,imgIndex) in item.cover.images" :key="imgIndex">
                  <van-image :src="imgItem" lazy-load />
                </van-grid-item>
              </van-grid>
              <!-- 详情信息区域 -->
              <div class="articleInfo">
                <div class="articleInfo_left">
                  <span class="auther">{{item.aut_name}}</span>
                  <span class="comment">{{item.comm_count}} 评论</span>
                  <span class="create_date">{{item.pubdate|timeFilter}}</span>
                </div>
                <div class="articleInfo_right">
                  <van-icon name="cross" />
                </div>
              </div>
              <!-- 文章点赞次数及评论 -->
              <van-grid :column-num="3" class="comment">
                <van-grid-item icon="comment-o" :text="item.comm_count.toString()" @click="openComment"></van-grid-item>
                <van-grid-item icon="like-o" text="点赞" @click="like"></van-grid-item>
                <van-grid-item icon="certificate" text="分享"></van-grid-item>
              </van-grid>
              <!-- <van-grid >
                <van-grid-item v-for="value in 3" :key="value" icon="photo-o" text="文字" />
              </van-grid> -->
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab></van-tab>
      <van-tab></van-tab>
      <van-tab></van-tab>
    </van-tabs>
  </div>
</template>

<script>
// 导入搜索相关的网络请求
import { searchResultsApi } from '../../api/search'
// 导入图片懒加载
import Vue from 'vue'
import { Lazyload } from 'vant'
// 使用图片懒加载
Vue.use(Lazyload)
export default {
  data () {
    return {
      value: '',
      isLoading: false,
      loading: false,
      // 搜索文章列表
      articlelist: [],
      // 当前显示页数
      page: 0,
      // 每页显示最多几条数据
      per_page: 15
    }
  },
  methods: {
    // 搜索事件
    openSearch () {
      this.$router.push('/search')
    },
    // 取消搜索事件
    onCancel () {
      this.$parent.showSearch = false
      this.$toast('取消')
    },
    // 得到搜索结果
    async getSearchResult () {
    },
    // 下拉刷新
    onRefresh () {
      this.isLoading = true
      this.articlelist = []
      this.onLoad()
      this.isLoading = false
    },
    // 上拉获取新的数据
    async onLoad () {
      // 获取搜索关键字
      this.value = this.$route.query.key
      // 每次上拉刷新，获取搜索的页码加1
      this.page++
      try {
        // 进行网络请求
        var res = await searchResultsApi({
          page: this.page,
          per_page: this.per_page,
          q: this.value
        })
        window.console.log(res)
        if (res.data.data.results == null) {
          this.loading = false
          this.$toast.fail('已经没有了！')
          return
        }
        // 拼接文章列表
        this.articlelist = [...this.articlelist, ...res.data.data.results]
        // 渲染完页面取消加载状态
        this.loading = false
        // 将返回的文章标题列表用数组保存
        var articleTitles = this.articlelist.map(item => {
          // 获取文章的标题跟搜索关键字一样的颜色设置为高亮
          return item.title.replace(new RegExp('(' + this.value + ')', 'g'), `<span style="color:red">${this.value}</span >`)
        })
        // 用高亮的文章标题列表替换原来的文章标题
        this.articlelist.forEach((item, index) => {
          item.title = articleTitles[index]
        })
      } catch {
        this.$toast.fail('失败')
      }
    },
    // 打开评论面板
    openComment () {
      // 如果用户登录了
      if (this.$isLogin()) {
      } else { // 没有登录
        this.$toast('你还没登录！')
        this.$router.push('checkLogin')
      }
    },
    // 点赞
    like () {
      // 如果用户登录了
      if (this.$isLogin()) {
      } else { // 没有登录
        this.$toast('你还没登录！')
        this.$router.push('checkLogin')
      }
    },
    // 跳转到详情页面、
    toDetail (item) {
      // window.console.log(item)
      this.$router.push(`/detail?id=${item.art_id}`)
    }
  },
  created () {
    this.getSearchResult()
  }
}
</script>

<style lang="less">
.searchResult_wrap {
  .van-search {
    position: fixed;
    z-index: 1;
    width: 100%;
    top: 0;
    left: 0;
  }
  .van-tabs.van-tabs--line {
    margin-top: 54px;
    .van-tabs__wrap.van-hairline--top-bottom {
      position: fixed;
      z-index: 1;
      width: 100%;
      top: 54px;
      left: 0;
      border-bottom: 1px solid rgb(163, 167, 158);
    }
    .van-pull-refresh {
      margin-top: 94px;

      .van-cell {
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
        .van-grid.van-hairline--top.comment {
          border: none;
          .van-grid-item__content {
            flex-direction: row;
            align-items: center;
            padding: 5px;

            .van-grid-item__icon {
              font-size: 18px;
            }
            .van-grid-item__text {
              margin: 0 5px 0;
            }
          }
        }
      }
      .van-cell:not(:last-child)::after {
        border-bottom: 1px solid rgb(211, 216, 205);
      }
    }
  }
}
</style>
