<template>
  <!-- <van-search v-model="value" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" /> -->
  <van-search v-model="value" shape="round" show-action background="#4fc08d" placeholder="请输入搜索关键词" @cancel="onCancel" />
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  },
  methods: {
    onSearch (val) {
      this.$toast(val)
    },
    onCancel () {
      this.$parent.showSearch = false
      this.$toast('取消')
    }
  }
}
</script>
<style>
</style>
