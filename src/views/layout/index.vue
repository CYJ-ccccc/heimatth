<template>
  <div>
    <router-view></router-view>
    <van-tabbar fixed route class="footer">
      <van-tabbar-item icon="wap-home-o" to="/index">首页</van-tabbar-item>
      <van-tabbar-item icon="comment-o" to="/question">问答</van-tabbar-item>
      <van-tabbar-item icon="play-circle-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="contact" to="/my">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
}
</script>
<style lang="less">
</style>
