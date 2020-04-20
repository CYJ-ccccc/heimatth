<template>
  <div class="login">
    <!-- 头部标题 -->
    <van-nav-bar title="登录" />
    <!-- 输入框区域 -->
    <van-cell-group>
      <!-- 输入手机号 -->
      <van-field v-model="form.mobile" placeholder="请输入手机号" :error-message="error_message_mobile">
        <template #label>
          <i class="iconfont">&#xe759;</i>
        </template>
      </van-field>
      <!-- 输入短信验证码 -->
      <van-field v-model="form.code" placeholder="请输入验证码" class="code" :error-message="error_message_code">
        <template #label>
          <i class="iconfont">&#xe75b;</i>
        </template>
        <template #button>
          <van-button size="small" type="default">获取验证码</van-button>
        </template>
      </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
    <div style="margin: 16px;">
      <van-button round block type="info" native-type="submit" class="sumit" @click="login" :loading="isLoading">登录</van-button>
    </div>
    <!-- 客户须知 -->
    <div class="clause">
      <a href="#">隐私条款</a>
    </div>
  </div>
</template>

<script>
// 导入提交登录的请求方法
import { loginApi } from '../../api/login'
export default {
  data () {
    return {
      form: {
        // 输入框手机号码
        mobile: '18352408797',
        // 输入框短信验证码
        code: '246810'
      },
      // 手机号码输入框错误提示信息
      error_message_mobile: '',
      // 短信验证码输入框错误提示信息
      error_message_code: '',
      // 登录按钮是否在等待提交
      isLoading: false
    }
  },
  methods: {
    // 提交登录信息
    async login () {
      // 将登录按钮设置为等待提交状态
      this.isLoading = true
      // 调用验证方法，是否验证成功
      if (this.check()) {
        // 使用try catch方法，一旦try里的函数中断，立即执行catch里的代码
        try {
          var res = await loginApi(this.form)
          // 调用vuex里的设置token的方法
          this.$store.commit('saveToken', res.data.data)
          // 得到当前请求的路由
          var path = this.$route.path
          // 判断该路由是正常登录页还是验证登录页
          if (path === '/login') {
            // 使用vant里的成功提交提示
            this.$toast.success('登录成功')
            this.$router.push('/layout')
          } else {
            this.$router.back()
          }
        } catch {
          // 使用vant里的失败提交提示
          this.$toast.fail('登录失败')
        }
      } else {
        alert('验证不通过')
      }
      // 将登录按钮取消等待提交状态
      this.isLoading = false
    },
    // 校验输入框内容格式是否正确
    check () {
      // 手机号码正则校验
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      // 声明一个数组用来存放校验是否验证成功
      var allPass = []
      // 判断手机号码是否填写正确
      if (reg.test(this.form.mobile) === false) {
        this.error_message_mobile = '手机格式不正确'
        allPass.push(false)
      } else {
        this.error_message_mobile = ''
        allPass.push(true)
      }
      // 判断验证码是否填写正确
      if (this.form.code.length !== 6) {
        this.error_message_code = '验证码格式不正确'
        allPass.push(false)
      } else {
        this.error_message_code = ''
        allPass.push(true)
      }
      // 验证成功返回true，否则为false
      if (!allPass.includes(false)) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="less" scope>
.login {
  .van-nav-bar.van-hairline--bottom {
    background-color: #3296fa;
    color: #fff;

    .van-nav-bar__title {
      color: #fff;
    }
  }
  .van-field {
    color: #c0c0c0;
    i {
      margin-right: 10px;
    }

    .van-field__label {
      width: 25px;
    }

    .van-button.van-button--small.van-button--default {
      border-radius: 15px;
      background-color: #ededed;
      border: none;
      text-align: center;

      span {
        color: #666666;
      }
    }
  }
  .van-field.code {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .sumit.van-button {
    border-radius: 5px;
    background-color: #6db4fb;
  }
  .clause {
    width: 100%;
    position: fixed;
    bottom: 30px;
    text-align: center;

    a {
      color: #666666;
    }
  }
}
</style>
