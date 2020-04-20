<template>
  <div>
    <!-- 渲染路由组件 -->
    <transition name="myrouter">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {}
</script>

<style>
/* .myrouter-enter {
  transform: translateX(100%);
}
.myrouter-enter-active {
  transition: all 0.1s;
}
.myrouter-enter-to {
  transform: translateX(0);
} */
</style>
