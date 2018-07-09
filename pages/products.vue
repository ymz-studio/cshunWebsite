<template>
  <div>
    <hero :src="require('assets/products/hero.jpg')" title="农产品介绍" subTitle="产品全面，价格透明，全年365天24小时电话，微信预定"></hero>
    <v-container class="bg-w" fluid>
      <v-container class="px-4 mb-5">
        <v-layout justify-center column align-center wrap>
          <h2>长顺四宝</h2>
          <v-flex xs8>
            <p class="text-xs-center sub-title">
              长顺县生物资源有水稻、玉米、烤烟、茶叶、黄姜、半夏、天麻、生姜、生漆、辣椒、豆腐皮、核桃、板栗、香蕉、梨、米花糖等，其中绿壳蛋鸡、高钙苹果、紫王葡萄、小米核桃被称为“长顺四宝”。
            </p>
          </v-flex>
        </v-layout>
        <template v-for="item in products" class="my-5">
          <v-layout wrap align-center justify-center :key="item.name" class="py-4" :reverse="item.reverse && !isMobile">
            <v-flex md6 xs12>
              <h2 class="text-xs-center">{{item.name}}</h2>
              <h3 class="text-xs-center my-h3 fw-500">{{item.description}}</h3>
            </v-flex>
            <v-flex md6 xs12>
              <v-layout align-center justify-center>
                <img :src="item.src" :alt="item.name" class="product-img">
              </v-layout>
            </v-flex>
          </v-layout>
        </template>
      </v-container>
    </v-container>
    <v-container class="has-border" fluid>
      <v-container class="pt-4">
        <v-layout justify-center column align-center>
          <h2>24小时不间断直播</h2>
          <resize-box class="stream my-4"></resize-box>
        </v-layout>
      </v-container>
    </v-container>
    <v-container class="bg-w" fluid>
      <v-container class="pt-4">
        <v-layout justify-center column align-center v-if="businesses.length>0">
          <h2>精选商家 品质无忧</h2>
          <resize-box class="mt-4">
            <v-carousel style="height:100%;" class="slide">
              <v-carousel-item v-for="item in businesses" :key="item.id" :src="item.img.url" transition="fade" reverse-transition="fade">
                <v-layout style="height:100%;cursor: pointer;" column justify-space-between @click="onClick(item.url)">
                  <vue-qrcode v-if="!isMobile" :value="item.url" :options="{ size: 200 }" class="qrcode"></vue-qrcode>
                  <div class="bottom-info">
                    <h3>{{item.name}}</h3>
                  </div>
                </v-layout>
              </v-carousel-item>
            </v-carousel>
          </resize-box>
        </v-layout>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import Hero from "@/components/hero.vue";
import resizeBox from "@/components/resizeBox.vue";
import gql from "graphql-tag";
import VueQrcode from "@xkeshi/vue-qrcode";
import { mapState } from "vuex";
export default {
  data() {
    return {
      slideIndex: null,
      businesses: [],
      products: [
        {
          name: "绿壳鸡蛋",
          description: "林间散养 稀有珍禽",
          src: require("assets/products/myproduct/eggs.png"),
          reverse: false
        },
        {
          name: "高钙苹果",
          description: "含钙丰富 贵州名牌",
          src: require("assets/products/myproduct/apple.png"),
          reverse: true
        },
        {
          name: "紫王葡萄",
          description: "味道鲜美 营养丰富",
          src: require("assets/products/myproduct/grape.png"),
          reverse: false
        },
        {
          name: "小米核桃",
          description: "养气补血",
          src: require("assets/products/myproduct/walnut.png"),
          reverse: true
        }
      ]
    };
  },
  methods: {
    onClick(url) {
      window.open(url, "_blank");
    }
  },
  computed: {
    ...mapState(["isMobile"])
  },
  components: {
    Hero,
    resizeBox,
    VueQrcode
  },
  apollo: {
    businesses: {
      query: gql`
        {
          businesses {
            id
            name
            url
            img {
              url
            }
          }
        }
      `
    }
  }
};
</script>

<style scoped>
.stream {
  width: 100%;
  height: 400px;
  background-color: black;
}
.slide >>> .jumbotron__image {
  width: 100%;
  height: 100%;
}
.bottom-info {
  padding: 1em 0;
  color: #fff;
  margin-bottom: 50px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
}
.qrcode {
  height: 200px;
  width: 200px;
  padding: 2em;
  align-self: flex-end;
}
.sub-title{
  font-size: 18px;
}
.mytitle{
  font-size: 3rem;
  text-align: center;
}
.my-h3{
  font-size: 1.5rem;
}
.fw-500 {
  font-weight: 500;
}
.bg-w {
  background-color: white;
}
.product-img {
  max-height: 284px;
}
.reverse {
  flex-direction: row-reverse;
}
.has-border{
  border-top: 2px solid rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}
</style>
