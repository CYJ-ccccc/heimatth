<template>
  <div class="detail">
    <!-- 页面标题 -->
    <van-nav-bar title="文章详情" right-text="..." left-arrow @click-left="onClickLeft" fixed />
    <div class="content_body">
      <!-- 文章标题 -->
      <h2 class="title">{{acticalContent.title}}</h2>
      <!-- 作者信息 -->
      <div class="aut_info">
        <div class="aut_info_left">
          <div class="aut_info_icon">
            <img :src="acticalContent.aut_photo" alt="">
          </div>
          <div class="aut_info_detail">
            <span class="aut_info_name">{{acticalContent.aut_name}}</span>
            <span class="aut_info_date">{{acticalContent.pubdate|timeFilter}}</span>
          </div>
        </div>
        <div class="aut_info_right">
          <van-button type="info" class="already_btn" size="small" @click="cancelFollow" v-if="isFollowed">
            <span class="aut_info_focus">已关注</span>
          </van-button>
          <van-button type="info" class="unalready_btn" size="small" @click="followAut" v-else>
            <van-icon name="plus" />
            <span class="aut_info_focus">关注</span>
          </van-button>
        </div>
      </div>
      <!-- 文章内容 -->
      <div class="aut_info_content">
        <van-cell size="large">
          <template #title>
            <div v-html="acticalContent.content">

            </div>
          </template>
        </van-cell>
      </div>
      <!-- 点赞&不喜欢 -->
      <div class="content_mark">
        <van-button type="default" class="content_mark_like">
          <van-icon name="like-o" />
          <span class="like">点赞</span>
        </van-button>
        <van-button type="default" class="content_mark_dislike">
          <van-icon name="delete" />
          <span class="dislike">不喜欢</span>
        </van-button>
      </div>
      <!-- 评论列表 -->
      <div class="content_list">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <van-cell v-for="(item,index) in comments" :key="index">
            <template #title>
              <div class="content_header">
                <div class="content_left">
                  <div class="content_icon">
                    <img :src="item.aut_photo" alt="">
                  </div>
                  <div class="content_aut_name">
                    {{item.aut_name}}
                  </div>
                </div>
                <div class="content_right">
                  <van-icon name="like" v-if="item.is_liking" />
                  <van-icon name="like-o" v-else />
                  <span class="content_focus">{{item.like_count}}</span>
                </div>
              </div>
              <div class="content">{{item.content}}</div>
              <div class="content_detail">
                <span class="content_date">{{item.pubdate|timeFilter}}</span>
                <span class="content_reply" @click="onConmment(item)">回复{{item.reply_count}}</span>
              </div>
            </template>
          </van-cell>
        </van-list>
      </div>
      <!-- 添加评论区域 -->
      <div class="addConmment">
        <van-search v-model="value" shape="round" background="#4fc08d" placeholder="写评论..." show-action>
          <template #action>
            <div @click="onSearch" class="submit">发布</div>
          </template>
          <template #left-icon>
            <van-icon name="edit" />
          </template>
        </van-search>
      </div>
    </div>
    <!-- 添加评论组件 -->
    <addComment ref="addComment" :item="item" :art_id="art_id" @changeCount="changeCount"></addComment>
  </div>
</template>
<script>
// 导入文章详情页的所有网络请求
import { getActDetailApi, followAutApi, cancelFollowAutApi } from '../../api/detail'
import { getCommentApi, submitCommentApi } from '../../api/comment'
// 导入回复评论组件
import addComment from './components/addComment'
export default {
  data () {
    return {
      // 文章id
      art_id: 0,
      // 加载状态
      loading: false,
      // 加载完毕
      finished: false,
      // 文章内容
      acticalContent: {},
      // 是否关注
      isFollowed: false,
      // 显示的评论个数
      limit: 10,
      // 获取下一页评论的标识
      offset: null,
      // 最后评论页的标识
      end_id: 0,
      // 评论列表
      comments: [],
      // 添加评论内容
      value: '',
      // 回复评论的评论项
      item: {}
    }
  },
  components: {
    addComment
  },
  methods: {
    // 点击标题左箭头
    onClickLeft () {
      this.$router.back()
    },
    // 获取文章详情
    async getArtDetail () {
      // 获取路由传过来的值
      this.art_id = this.$route.query.id
      // window.console.log(this.art_id)
      try {
        var res = await getActDetailApi(this.art_id)
        // window.console.log(res)
        this.acticalContent = res.data.data
      } catch {
        this.$toast('获取文章内容失败')
      }
    },
    // 关注用户
    async followAut () {
      try {
        var res = await followAutApi({
          target: this.acticalContent.aut_id
        })
        if (res.status === 201) {
          this.$toast.success('关注成功')
          this.isFollowed = true
        }
      } catch (error) {
        this.$toast.fail('关注失败！请重试')
      }
    },
    // 取消关注
    async cancelFollow () {
      try {
        var res = await cancelFollowAutApi(this.acticalContent.aut_id)
        if (res.status === 204) {
          this.$toast.success('取消关注成功')
          this.isFollowed = false
        }
      } catch (error) {
        this.$toast.fail('取消关注失败！请重试')
      }
    },
    // 上拉加载评论列表
    async onLoad () {
      try {
        var res = await getCommentApi({
          source: this.art_id,
          type: 'a',
          offset: this.offset,
          limit: this.limit
        })
        window.console.log(res)
        // 保存评论列表
        this.comments = [...this.comments, ...res.data.data.results]
        // 保存下一页的标识
        this.offset = res.data.data.last_id
        // 保存最后页的标识
        this.end_id = res.data.data.end_id
        if (this.offset === this.end_id) {
          this.finished = true
        }
        // 将list加载取消
        this.loading = false
      } catch (error) {
        this.$toast('获取评论失败')
      }
    },
    // 发布评论内容
    async onSearch () {
      try {
        var res = await submitCommentApi({
          target: this.art_id,
          content: this.value
        })
        window.console.log(res.data.data.new_obj)
        if (res.status === 201) {
          this.$toast.success('评论成功')
          // 将返回的新对象传追加到评论列表中
          this.comments.unshift(res.data.data.new_obj)
        }
      } catch (error) {
        this.$toast.fail('评论失败')
      }
    },
    // 回复评论
    onConmment (item) {
      // window.console.log(item)
      this.$refs.addComment.show = true
      this.item = item
    },
    // 回复评论，评论数+1
    changeCount () {
      this.item.reply_count++
    }
  },
  created () {
    this.getArtDetail()
  }
}
</script>

<style lang="less" scoped>
.detail {
  .van-nav-bar {
    background-color: rgb(79, 192, 141);
    display: flex;
    align-items: center;
    .van-nav-bar__left {
      .van-icon {
        color: #fff;
      }
    }

    .van-nav-bar__title {
      color: #fff;
    }
    .van-nav-bar__right {
      display: flex;
      align-items: center;
      .van-nav-bar__text {
        color: #fff;
      }
    }
  }
  .content_body {
    position: fixed;
    width: 100%;
    bottom: 54px;
    top: 46px;
    padding: 0 15px;
    overflow: scroll;

    .title {
      margin: 15px 0px;
      text-align: center;
    }
    .aut_info_content {
      * {
        width: 100%;
      }
    }
    .aut_info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 10px;

      .aut_info_left {
        display: flex;
        align-items: center;
        .aut_info_icon {
          display: inline-block;
          width: 50px;
          height: 50px;
          margin-right: 10px;
          // background-color: pink;
          img {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }
        .aut_info_detail {
          .aut_info_name,
          .aut_info_date {
            display: block;
          }
        }
      }
      .aut_info_right {
        .unalready_btn {
          background-color: rgb(79, 192, 141);
          border: none;
          .van-button__text {
            display: flex;
            align-items: center;
            .aut_info_focus {
              margin-left: 5px;
            }
          }
        }
        .already_btn {
          background-color: rgb(204, 202, 202);
          border: none;
        }
      }
    }
    .content_mark {
      padding: 10px 30px;
      display: flex;
      justify-content: space-around;
      .content_mark_like,
      .content_mark_dislike {
        display: flex;
        align-content: center;
        span {
          margin-left: 8px;
        }
      }
    }
    .content_list {
      .van-list {
        .van-cell {
          padding: 10px 0;
          .van-cell__title {
            .content_header {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .content_left {
                display: flex;
                align-items: center;
                .content_icon {
                  display: inline-block;
                  width: 50px;
                  height: 50px;
                  margin-right: 10px;
                  border-radius: 50%;
                  img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
              .content_right {
                display: flex;
                align-items: center;
                .van-icon {
                  margin-right: 5px;
                }
              }
            }
          }
          .content,
          .content_detail {
            padding-left: 62px;
          }
          .content_date {
            margin-right: 10px;
          }
        }
      }
    }
  }
  .addConmment {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;

    .van-search__action {
      .submit {
        color: #fff;
      }
    }
  }
}
</style>
