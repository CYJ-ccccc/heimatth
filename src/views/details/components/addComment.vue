<template>
  <div class="addComent">
    <van-popup v-model="show" position="bottom" :style="{ height: '93%' }" @open="openPopup">
      <!-- 评论 -->
      <div class="content_list">
        <van-cell>
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
            </div>
          </template>
        </van-cell>
      </div>
      <!-- 评论回复列表 -->
      <div class="replyComment">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :immediate-check="isCheck">
          <van-cell v-for="(item,index) in replyList" :key="index">
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
                <span class="content_reply">回复 {{item.reply_count}}</span>
              </div>
            </template>
          </van-cell>
        </van-list>
      </div>
      <!-- 添加评论回复区域 -->
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
    </van-popup>
  </div>
</template>

<script>
// 获取回复评论的网络请求
import { getReplyCommentsApi, replyCommentApi } from '../../../api/comment'
export default {
  props: ['item', 'art_id'],
  data () {
    return {
      show: false,
      // 加载状态
      loading: false,
      // 加载完毕
      finished: false,
      // 是否需要下一页的标识
      offset: null,
      // 最后一页的标识
      end_id: 0,
      // 一页承载评论的个数
      limit: 10,
      // 评论回复列表
      replyList: [],
      // 提交评论回复
      value: '',
      // 是否初始化onload
      isCheck: false
    }
  },
  methods: {
    // 向上滚动加载评论回复
    async onLoad () {
      window.console.log((this.item.com_id).toString())
      window.console.log((this.offset))
      window.console.log((this.end_id))
      window.console.log((this.finished))
      try {
        var res = await getReplyCommentsApi({
          type: 'c',
          source: (this.item.com_id).toString(),
          offset: this.offset,
          limit: this.limit
        })
        window.console.log(res)
        this.replyList = [...this.replyList, ...res.data.data.results]
        // 保存下一页的标识
        this.offset = res.data.data.last_id
        // 保存最后页的标识
        this.end_id = res.data.data.end_id
        // 停止加载
        this.loading = false
        if (this.end_id === this.offset) {
          this.finished = true
        }
      } catch (error) {
        this.$toast.fail('获取评论失败')
      }
    },
    // 打开弹出层时
    openPopup () {
      // 清空评论回复
      this.replyList = []
      // 清空下一页的标识
      this.offset = null
      // 清空最后一页的标识
      this.end_id = 0
      // 加载状态初始化
      this.loading = false
      // 加载完毕初始化
      this.finished = false
      this.onLoad()
    },
    // 提交评论回复
    async onSearch () {
      window.console.log(this.item)
      try {
        var res = await replyCommentApi({
          target: (this.item.com_id).toString(),
          content: this.value,
          art_id: this.art_id
        })
        window.console.log(res.data.data.new_obj)
        if (res.status === 201) {
          this.$toast.success('回复评论成功')
          // 将返回的新对象传追加到评论列表中
          this.replyList.unshift(res.data.data.new_obj)
          // 将本评论回复+1
          this.$emit('changeCount')
          // 清空输入框
          this.value = ''
        }
      } catch (error) {
        this.$toast.fail('评论失败')
      }
    }
  },
  created () {
    // window.console.log(this.item)
  }
}
</script>

<style lang="less" scope>
.addComent {
  padding: 10px;
  .content_list {
    .van-cell {
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
  .replyComment {
    .van-list {
      .van-cell {
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
