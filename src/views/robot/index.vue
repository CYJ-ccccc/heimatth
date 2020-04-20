<template>
  <div class="robot">
    <!-- 导航标题 -->
    <van-nav-bar title="小智同学" left-arrow @click-left="onClickLeft" />
    <!-- 聊天区域 -->
    <div class="chatArea" ref="chatArea">
      <!-- 聊天区域 -->
      <div class="Chat" v-for="(item,index) in msgArr" :key="index" :class="{robot_Chat:item.isUser===false,user_Chat:item.isUser===true}">
        <div class="icon">
          <img src="http://img3.imgtn.bdimg.com/it/u=3409561333,3155535696&fm=26&gp=0.jpg" alt="">
        </div>
        <div class="msg">
          {{item.msg}}
        </div>
      </div>
    </div>
    <!-- 添加聊天区域 -->
    <div class="addChat">
      <van-search v-model="value" shape="round" background="#4fc08d" placeholder="说点什么吧..." show-action>
        <template #action>
          <div @click="onSubmit" class="submit">发送</div>
        </template>
        <template #left-icon>
          <van-icon name="edit" />
        </template>
      </van-search>
    </div>
  </div>
</template>

<script>
// 导入socket.io-client
import Io from 'socket.io-client'
export default {
  data () {
    return {
      value: '',
      socket: null,
      // 聊天记录数组
      msgArr: [
        {
          msg: '你好啊，我是机器人小智',
          isUser: false
        }
      ]
    }
  },
  methods: {
    // 返回
    onClickLeft () {
      this.$router.back()
    },
    // 提交聊天内容
    onSubmit () {
      // 将用户发表的聊天推送到聊天区域
      this.msgArr.push({
        msg: this.value,
        isUser: true
      })
      // 让聊天区域滚动到底部
      this.$nextTick(() => {
        this.$refs.chatArea.scrollTop = this.$refs.chatArea.scrollHeight
      })
      // 用户发表的聊天发送给socket.io服务器
      this.socket.emit('message', {
        msg: this.value,
        timestamp: Date.now()
      })
      // 清空发送框
      this.value = ''
    }
  },
  mounted () {
    // 得到token
    var token = this.$store.state.token.token
    // 连接socket.io服务器
    this.socket = Io(`http://ttapi.research.itcast.cn?token=${token}`)
    // 接收socket.io服务器返回来的数据
    this.socket.on('message', data => {
      // window.console.log(data)
      this.msgArr.push({
        msg: data.msg,
        isUser: false
      })
      // 让聊天区域滚动到底部
      this.$nextTick(() => {
        this.$refs.chatArea.scrollTop = this.$refs.chatArea.scrollHeight
      })
    })
  }
}
</script>

<style lang="less">
.robot {
  .van-nav-bar {
    background-color: rgb(79, 192, 141);
    .van-nav-bar__left {
      .van-icon {
        color: #fff;
      }
    }
    .van-nav-bar__title {
      color: #fff;
    }
  }
  .chatArea {
    position: fixed;
    bottom: 54px;
    top: 46px;
    width: 100%;
    padding: 15px 8px;
    // background-color: pink;
    background: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586950465318&di=b6ba78d29180ed20c5cf6d993fdfb20b&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201803%2F04%2F20180304005326_ujlwr.thumb.700_0.jpg")
      no-repeat 0px -32px;
    background-size: 100%;
    overflow: scroll;

    .Chat {
      width: 100%;
      height: 50px;
      .icon,
      .msg {
        width: 70%;
        display: inline-block;
      }
      .icon {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .msg {
        padding: 8px;
        border-radius: 8px;
      }
    }
    .robot_Chat {
      .icon,
      .msg {
        float: left;
      }
      .msg {
        background-color: #fff;
        margin-left: 8px;
      }
    }
    .user_Chat {
      .icon,
      .msg {
        float: right;
      }
      .msg {
        background-color: rgb(79, 192, 141);
        margin-right: 8px;
      }
    }
  }
  .addChat {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    .submit {
      color: #fff;
    }
  }
}
</style>
