<template>
  <v-carousel class="slide">
    <v-carousel-item v-for="(item,i) in items" :src="item.src" :key="i"
      reverse-transition="fade" transition="fade">
      <v-container fill-height>
        <v-layout column justify-center align-center>
          <h1 :style="{color:item.color}">{{item.title}}</h1>
          <v-btn nuxt outline flat v-if="item.show_btn" @click="open(item)"
            :style="{color:item.color}">了解详情</v-btn>
        </v-layout>
      </v-container>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          src: require("assets/index/xjp_front.jpg"),
          title: "",
          color: "#000",
          url: "/about",
          show_btn: false
        },
        {
          src: require("assets/index/background-4.jpg"),
          title: "专家咨询 答疑解惑",
          color: "#fff",
          url: "/consultant",
          show_btn: true
        },
        {
          src: require("assets/index/background-3.jpg"),
          title: "时新政策 高效助农",
          color: "#fff",
          url: "/policy",
          show_btn: true
        },
        {
          src: require("assets/index/background-2.jpg"),
          title: "智能匹配 产销无忧",
          color: "#fff",
          url: "http://39.98.84.18:3000",
          show_btn: true,
          isOut: true
        },
        {
          src: require("assets/index/background-1.jpg"),
          title: "实时大数据 可视化呈现",
          color: "#000",
          url: "http://39.98.84.18",
          show_btn: true,
          isOut: true
        }
      ]
    };
  },
  methods: {
    open(item) {
      if (item.isOut) {
        window.open(item.url);
      } else this.$router.push(item.url);
    }
  }
};
</script>

<style lang="stylus" scoped>
.slide {
  height: 100%;
}
</style>
