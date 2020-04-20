<template>
  <div class="my_info">
    <!-- 用户信息区域 -->
    <div class="user_info">
      <div class="user_info_account">
        <div class="user_info_left">
          <div class="user_icon" @click="onSetUserInfo"><img :src="userInfo.photo" alt=""></div>
          <div class="user_name">{{userInfo.name}}</div>
          <!-- <span class="user_set">设置</span> -->
        </div>
        <div class="user_info_right">
          <span>
            <van-icon name="records" /></span>
          <div class="read_time">
            <div>今日阅读</div>
            <div>5分钟</div>
          </div>
        </div>
      </div>
      <div class="user_info_msg">
        <div class="trend">
          <span>{{userInfo.art_count}}</span>
          <span>动态</span>
        </div>
        <div class="focus">
          <span>{{userInfo.follow_count}}</span>
          <span>关注</span>
        </div>
        <div class="fans">
          <span>{{userInfo.fans_count}}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>
    <!-- 收藏区域 -->
    <van-grid>
      <van-grid-item icon="star-o" text="收藏" />
      <van-grid-item icon="clock-o" text="历史" />
      <van-grid-item icon="edit" text="作品" />
    </van-grid>
    <!-- 分栏一 -->
    <div class="cell1">
      <van-cell title="消息通知" is-link />
      <van-cell title="实名认证" is-link />
    </div>
    <!-- 分栏二 -->
    <div class="cell2">
      <van-cell title="用户反馈" is-link />
      <van-cell title="小智同学" is-link @click="onRobot" />
      <van-cell title="系统设置" is-link />
    </div>
  </div>

</template>
<script>
// 导入获取用户个人信息的网络请求
import { getUserInfoApi1 } from '../../api/user'
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  methods: {
    // 获取个人信息
    async getUserInfo () {
      try {
        var res = await getUserInfoApi1()
        window.console.log(res)
        this.userInfo = res.data.data
      } catch (error) {

      }
    },
    // 个人信息设置
    onSetUserInfo () {
      this.$router.push('/user')
    },
    // 打开聊天机器人
    onRobot () {
      this.$router.push('/robot')
    }

  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="less">
.my_info {
  background-color: #eee;
  .user_info {
    width: 100%;
    height: 200px;
    background-color: rgb(79, 192, 141);
    padding: 40px;
    .user_info_account {
      position: relative;
      .user_info_left {
        display: flex;
        align-content: center;
        .user_icon {
          display: inline-block;
          width: 40px;
          height: 40px;
          margin-right: 10px;
          img {
            border-radius: 50%;
            width: 100%;
          }
        }
        .user_name {
          color: #fff;
        }
      }

      .user_info_right {
        position: absolute;
        display: flex;
        align-items: center;
        right: -40px;
        top: 0;
        padding: 6px;
        border-radius: 19px 0 0 19px;
        background-color: rgb(146, 143, 143);
        opacity: 0.6;

        .van-icon {
          color: #fff;
        }
        .read_time {
          display: inline-block;

          div {
            font-size: 8px;
            color: #fff;
          }
        }
      }
    }
    .user_info_msg {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;

      .trend,
      .focus,
      .fans {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
      }
    }
  }
  .van-grid {
    .van-grid-item {
      flex: 1;
    }
  }
  .cell1 {
    margin: 10px 0;
  }
}
</style>
