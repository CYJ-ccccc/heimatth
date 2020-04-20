<template>
  <div class="userInfo">
    <van-nav-bar title="个人信息" left-arrow @click-left="editCancel" />
    <van-cell title="头像" is-link class="user_icon" @click="openIconSet">
      <template #default>
        <div class="icon">
          <img :src="userInfo.photo" alt="">
        </div>
      </template>
    </van-cell>
    <van-cell title="昵称" is-link :value="userInfo.name" @click="openNickname(userInfo.name)" />
    <van-cell title="介绍" is-link :value="userIntro" />
    <van-cell title="性别" is-link :value="userInfo.gender===0?'男':'女'" @click="opengender" />
    <van-cell title="生日" is-link :value="userInfo.birthday" @click="openDate" />
    <!-- 头像上传组件 -->
    <upload ref="upload" @changeIcon="v=>userInfo.photo=v"></upload>
    <!-- 昵称修改弹框 -->
    <van-popup v-model="nickNameShow" :style="{height:'100%'}" position="bottom" class="nickname">
      <van-nav-bar title="设置名字" left-text="取消" right-text="完成" left-arrow @click-left="editCancel" @click-right="nicknameSubmit" />
      <van-field v-model="nickNameValue" placeholder="请输入昵称" right-icon="close" @click-right-icon="()=>nickNameValue=''" />
    </van-popup>
    <!-- 性别修改弹框 -->
    <van-popup v-model="genderShow" :style="{height:'40%'}" position="bottom">
      <van-picker :columns="columns" @change="onChange" />
    </van-popup>
    <!-- 生日选择弹框 -->
    <van-popup v-model="dateShow" position="bottom">
      <van-datetime-picker v-model="currentDate" type="datetime" :min-date="minDate" :max-date="maxDate" @confirm="confirm" />
    </van-popup>
  </div>

</template>
<script>
// 导入dayjs
import dayjs from 'dayjs'
// 导入获取、修改用户个人信息的网络请求
import { getUserInfoApi1, getUserInfoApi2, reviseUserInfoApi } from '../../api/user'
// 导入子组件upload
import upload from './components/upload'
// 全局使用中文语言包to
dayjs.locale('zh-cn')
export default {
  data () {
    return {
      // 用户信息
      userIntro: '',
      userInfo: {},
      // 日期选择框是否弹出
      dateShow: false,
      // 昵称修改框是否弹出
      nickNameShow: false,
      // 性别修改框是否弹出
      genderShow: false,
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(),
      // 昵称输入框
      nickNameValue: '',
      // 性别选择
      columns: ['', '男', '女']
    }
  },
  components: {
    upload
  },
  methods: {
    editCancel () {
      this.$router.back()
    },
    // 获取用户的个人信息
    async getUserInfo () {
      try {
        var res1 = await getUserInfoApi1()
        var res2 = await getUserInfoApi2()
        this.userIntro = res1.data.data.intro
        this.userInfo = res2.data.data
        window.console.log(this.userInfo)
      } catch (error) {
        this.$toast.fail('获取个人信息失败')
      }
    },
    // 打开图片设置
    openIconSet () {
      this.$refs.upload.show = true
    },
    // 打开昵称设置
    openNickname (name) {
      this.nickNameShow = true
      this.nickNameValue = name
    },
    // 提交修改昵称
    async nicknameSubmit () {
      try {
        this.nickNameShow = false
        var res = await reviseUserInfoApi({
          name: this.nickNameValue
        })
        window.console.log(res)
        if (res.status === 201) {
          this.userInfo.name = this.nickNameValue
          this.$toast.success('操作成功')
        }
      } catch (error) {
        this.$toast.fail('操作失败，请重试！')
      }
    },
    // 打开性别弹框
    opengender () {
      this.genderShow = true
    },
    // 提交性别修改
    async onChange (picker, value, index) {
      var gender = value === '男' ? 0 : 1
      window.console.log(gender)
      try {
        this.genderShow = false
        var res = await reviseUserInfoApi({
          gender: gender
        })
        window.console.log(res)
        if (res.status === 201) {
          this.userInfo.gender = gender
          this.$toast.success('操作成功')
        }
      } catch (error) {
        this.$toast.fail('操作失败，请重试！')
      }
    },
    // 打开时间设置
    openDate () {
      this.dateShow = true
    },
    // 点击时间修改提交
    async confirm (val) {
      var date = dayjs(val).format('YYYY-MM-DD')
      this.dateShow = false
      try {
        var res = await reviseUserInfoApi({
          birthday: date
        })
        window.console.log(res)
        if (res.status === 201) {
          this.userInfo.birthday = date
          this.$toast.success('操作成功')
        }
      } catch (error) {
        this.$toast.fail('操作失败，请重试！')
      }
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scope>
.userInfo {
  .van-nav-bar {
    background-color: rgb(79, 192, 141);
    .van-nav-bar__left {
      .van-icon {
        color: #fff;
      }
    }
    .van-nav-bar__title {
      color: 000;
    }
    .van-nav-bar__right {
      .van-nav-bar__text {
        color: #fff;
      }
    }
    .van-nav-bar__text {
      color: #fff;
    }
  }
  .nickname.van-popup {
    background-color: #ccc;
    .van-nav-bar {
      background-color: #ccc;
      .van-nav-bar__text,
      .van-icon {
        color: #000;
      }
    }
  }
  .user_icon {
    .icon {
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
  }
}
</style>
