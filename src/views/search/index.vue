<template>
  <div class="search">
    <!-- 搜索框区域 -->
    <van-search v-model="value" shape="round" show-action background="#4fc08d" placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" @input="suggestion" />
    <div class="searchContent">
      <!-- 搜索历史 -->
      <van-cell-group v-if="value.length===0">
        <van-cell title="历史记录" value="内容" class="histroy">
          <template #default>
            <van-icon name="delete" @click="delHisrtoy" />
          </template>
        </van-cell>
        <van-cell v-if="histroyList.length===0">
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <span class="custom-title">无</span>
          </template>
        </van-cell>
        <van-cell v-for="(item,index) in histroyList" :key="index" @click="onSearch(item)" v-else>
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <span class="custom-title">{{item}}</span>
          </template>
        </van-cell>
      </van-cell-group>
      <!-- 联想区域 -->
      <van-cell-group v-else>
        <van-cell v-for="(item,index) in suggestionList" :key="index" @click="onSearch(item.searchVal)">
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <van-icon name="search" />
            <span class="custom-title" v-html="item.searchValHtml"></span>
          </template>
        </van-cell>
      </van-cell-group>
      <br>
    </div>
  </div>
</template>

<script>
// 导入网络请求相关方法
import { suggestionApi, gethistroiesApi, delHistroyApi } from '../../api/search'
export default {
  data () {
    return {
      // 搜索框内容
      value: '',
      // 联想内容列表
      suggestionList: [],
      // 历史搜索
      histroyList: [],
      // 设置计时器
      timer: null
    }
  },
  methods: {
    // 搜索事件
    onSearch (val) {
      // 将此搜索值保存在历史搜索中
      // 从历史数组前面插入
      this.histroyList.unshift(val)
      // 数组去重
      this.histroyList = [...new Set(this.histroyList)]
      window.console.log(this.histroyList)
      // 如果用户未登录保存该历史搜索信息在本地
      var token = this.$store.state.token.token
      if (!token) {
        window.localStorage.setItem('histroy', JSON.stringify(this.histroyList))
      }
      this.$router.push(`/searchResult?key=${val}`)
    },
    // 取消搜索事件
    onCancel () {
      this.$parent.showSearch = false
      this.$toast('取消')
    },
    // 获取联想方法
    suggestion () {
      clearInterval(this.timer)
      this.timer = setTimeout(async () => {
        // 判断输入框中的内容是否为空
        if (this.value.trim().length === 0) {
          return // 结束后续代码
        }
        try {
          var res = await suggestionApi({
            q: this.value
          })
          // window.console.log(res)
          this.suggestionList = res.data.data.options
          this.suggestionList = this.suggestionList.map(item => {
            return {
              searchVal: item,
              searchValHtml: item.replace(this.value, `<span style="color:#4fc08d">${this.value}</span>`)
            }
          })
        } catch {
          this.$toast.fail('搜索失败!')
        }
      }, 1000)
    },
    // 获取搜索历史的方法
    async gethistroies () {
      // 如果登录了，从服务器中获取用户搜索历史
      if (this.$isLogin()) {
        try {
          var res = await gethistroiesApi()
          // window.console.log(res)
          this.histroyList = res.data.data.keywords
          // window.console.log(this.histroyList)
        } catch (error) {
          this.$toast.fail('获取历史数据失败')
        }
      } else {
        this.histroyList = JSON.parse(window.localStorage.getItem('histroy')) || []
      }
      // window.console.log(this.histroyList)
    },
    // 清除历史搜索记录
    delHisrtoy () {
      // 确认是否真要删除
      this.$dialog.confirm({
        message: '你确定要清除所有搜索记录吗？'
      }).then(async () => {
        if (this.$isLogin()) { // 用户已登录
          try {
            var res = await delHistroyApi()
            window.console.log(res)
            // this.$toast.success('清除成功')
          } catch (error) {
            this.$toast.fail('服务器错误！请重试')
          }
        } else { // 用户未登录
          window.localStorage.removeItem('histroy')
          this.histroyList = []
        }
      }).catch(() => {
        this.$toast('已取消')
      })
    }
  },
  created () {
    this.gethistroies()
  }
}
</script>

<style lang="less">
.search {
  .van-cell-group {
    .van-cell {
      .van-cell__title {
        display: flex;
        align-items: center;

        .van-icon {
          margin-right: 5px;
        }
      }
    }
    .histroy.van-cell {
      .van-cell__title {
        font-weight: 700;
      }
    }
  }
}
</style>
