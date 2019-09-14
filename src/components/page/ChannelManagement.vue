<template id="news">
  <div class="">
    <p>渠道管理</p>

    <el-button @click="increment">增加</el-button>
    <el-button @click="decrement">减少</el-button>

    <div class="">
      现在的数字为:{{count}}
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: mapGetters([
    'count'
  ]),
  methods: mapActions([
    'increment',
    'decrement'
  ])
}
</script>

<style>
</style>
