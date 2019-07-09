<template>
    <div>
        <div class="clo">A页 请求电影数据结果：{{$store.state.movie.id}}</div>
        <div style="margin-top: 50px" @click="jump">下一页</div>
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
      return store.dispatch('fetchMovie', 12345)
    },
    computed: {
    },
    components: {
    },
    created() {
    },
    methods: {
      jump() {
        console.log(333)
        this.$router.push({name: 'B'})
      }
    },
    mounted() {
    }
  }
</script>

<style lang='scss'>
    .clo {
        color: red;
    }
</style>
