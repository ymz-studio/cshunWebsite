<template>
    <div>
        <hero :src="require('assets/products/hero.jpg')" title="农产品介绍" subTitle="产品全面，价格透明，全年365天24小时电话，微信预定"></hero>
        <v-container class="pt-4">
            <v-layout justify-center column align-center>
                <h2>24小时不间断直播</h2>
                <resize-box class="stream my-4"></resize-box>
            </v-layout>
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
    </div>
</template>

<script>
import Hero from '@/components/hero.vue'
import resizeBox from '@/components/resizeBox.vue'
import gql from 'graphql-tag';
import VueQrcode from '@xkeshi/vue-qrcode';
import { mapState } from 'vuex';
export default {
    data() {
        return {
            slideIndex: null,
            businesses: [],

        }
    },
    methods: {
        onClick(url) {
            window.open(url, "_blank");
        }
    },
    computed: {
        ...mapState(['isMobile'])
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
                businesses{
                    id
                    name
                    url
                    img{
                    url
                    }
                }
            }`
        }
    }
}
</script>

<style scoped>
.stream{
    width: 100%;
    height: 400px;
    background-color: black;
}
.slide >>> .jumbotron__image{
    width: 100%;
    height: 100%;
}
.bottom-info{
   padding: 1em 0;
   color: #fff;
   margin-bottom: 50px;
   text-align: center;
   background-color: rgba(0, 0, 0, .5)
}
.qrcode{
    height: 200px;
    width: 200px;
    padding: 2em;
    align-self: flex-end;
}
</style>