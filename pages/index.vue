<template>
  <v-carousel class="slide">
    <v-carousel-item v-for="(item,i) in items" :src="item.src" :key="i">
      <v-layout column align-center>
        <h1 :style="{color:item.color}">{{item.title}}</h1>
        <v-btn nuxt outline flat :to="item.url" :style="{color:item.color}">了解详情</v-btn>
      </v-layout>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { src: '/index-background-1.jpg', title: '精彩贵州 吉祥长顺', color: '#000', url: '/about' },
        { src: '/index-background-2.jpg', title: '无添加农产品 纯天然美味', color: '#fff', url: '/products' },
        { src: '/index-background-3.jpg', title: '自然风光 无限美好', color: '#fff', url: '/spots' },
        { src: '/index-background-4.jpg', title: '专家咨询 答疑解惑', color: '#fff', url: '/consultant' }
      ]
    }
  },
}
</script>

<style lang="stylus" scoped>
.slide {
  height: 100%;
}
</style>