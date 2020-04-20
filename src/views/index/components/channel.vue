<template>
  <div>
    <van-popup v-model="show" position="bottom" :style="{ width: '100%', height:'90%' }">
      <!-- 我的频道 -->
      <van-cell-group>
        <van-cell title="我的频道">
          <template #default>
            <van-button plain type="primary" size="mini" round color="red" @click="idEdit=!idEdit">编辑</van-button>
          </template>
        </van-cell>
        <van-grid :gutter="10">
          <van-grid-item v-for="(item,index) in channels" :key="index" :class="{active:active===index}" @click.stop="changeChannel(index)">
            {{item.name}}
            <van-icon name="clear" v-if="idEdit" @click="deleteChannel(index)" />
          </van-grid-item>
        </van-grid>
        <!-- <van-tag type="danger" size="large" v-for="(item,index) in channels" :key="index"> {{item.name}}</van-tag> -->
      </van-cell-group>
      <!-- 频道推荐 -->
      <van-cell-group>
        <van-cell title="频道推荐">
          <template #value>
            <van-button plain type="primary">朴素按钮</van-button>
          </template>
        </van-cell>
        <van-grid square>
          <!-- 遍历筛选计算数据数组 -->
          <van-grid-item v-for="(item,index) in recomChannels" :key="index" :text="item.name" @click="addChannel(item)" />
        </van-grid>
      </van-cell-group>
    </van-popup>
  </div>
</template>

<script>
// 导入获取全部频道的方法resetChannelsApi
import { getAllChannelsApi, resetChannelsApi } from '../../../api/index'
export default {
  props: ['channels', 'active'],
  data () {
    return {
      // 频道弹出区域显示隐藏开关
      show: false,
      // 全部频道列表
      allChannels: [],
      idEdit: false
    }
  },
  methods: {
    // 获取全部频道数据
    async getAllChannels () {
      var res = await getAllChannelsApi()
      // window.console.log(res)
      this.allChannels = res.data.data.channels
    },
    // 添加频道
    async addChannel (item) {
      // 给添加进来的频道添加属性
      this.$set(item, 'articlelist', [])
      this.$set(item, 'loading', false)
      this.$set(item, 'finished', false)
      this.$set(item, 'isLoading', false)
      // 将此点击频道添加到我的频道里
      this.channels.push(item)
      // 如果登录了，将此项添加到服务器中
      if (this.$isLogin()) {
        var resetChannels = this.channels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2 // 第一项默认显示，不能删除
          }
        })
        try {
          const res = await resetChannelsApi(resetChannels)
          window.console.log(res)
        } catch {
          this.$toast.fail('修改频道失败！')
        }
      } else { // 如果没有登录，将此频道保存在本地中 localStorage中
        window.localStorage.setItem('Channels', JSON.stringify(this.channels))
      }
    },
    // 删除频道
    async deleteChannel (index) {
      // 将与index一样下标的频道从我的频道里删除
      this.channels.splice(index, 1)
      // 判断用户是否登录
      if (this.$isLogin()) {
        var resetChannels = this.channels.slice(1).map((item, index) => {
          return {
            id: item.id,
            seq: index + 2 // 第一项默认显示，不能删除
          }
        })
        window.console.log(resetChannels)
        try {
          const res = await resetChannelsApi(resetChannels)
          window.console.log(res)
        } catch {
          this.$toast.fail('修改频道失败！')
        }
      } else { // 如果没有登录，将此频道保存在本地中 localStorage中
        window.localStorage.setItem('Channels', JSON.stringify(this.channels))
      }
    },
    // 改变显示的频道
    changeChannel (index) {
      this.$emit('update:active', index)
    }
  },
  computed: {
    // 封装一个筛选推荐频道的方法
    recomChannels () {
      // 获取我的频道里的id
      var ids = this.channels.map(item => {
        return item.id
      })
      // 筛选推荐频道
      var recomChannelsList = this.allChannels.filter(item => {
        return !ids.includes(item.id)
      })

      return recomChannelsList
    }
  },
  created () {
    this.getAllChannels()
  }
}
</script>

<style lang="less">
.van-icon.van-icon-clear {
  position: absolute;
  top: 0;
  right: 0;
  font-size: "24px";
}
.van-grid {
  .van-grid-item {
    border-radius: 16px;
    .van-grid-item__content {
      font-size: 8px;
    }
  }
}
.active {
  color: red;
}
</style>
