<template>
    <div>
        <div class="clo">B页 请求电影数据结果：{{item}}</div>
    </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    asyncData(store, route) {
      // 请求电影数据， 传入 ID ： 12345
      console.log('我被调用了')
      return store.dispatch('fetchMovie', 66666)
    },
    computed: {
      item() {
        return this.$store.state.movie
      }
    },
    components: {},
    created() {
    },
    methods: {},
    mounted() {
    }
  }
</script>

<style lang='scss'>
    .clo {
        color: red;
    }
</style>
