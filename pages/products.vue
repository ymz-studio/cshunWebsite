<template>
    <div>
        <hero :src="require('assets/products/hero.jpg')" title="农产品介绍" subTitle="产品全面，价格透明，全年365天24小时电话，微信预定"></hero>
        <v-container class="pt-4">
            <v-layout justify-center column align-center>
                <h2>24小时不间断直播</h2>
                <resize-box class="stream my-4"></resize-box>
            </v-layout>
            <v-layout justify-center column align-center>
                <h2>精选商家 品质无忧</h2>
                <resize-box v-if="features.length && features.length>0" class="mt-4">
                    <v-carousel style="height:100%;" class="slide">
                        <v-carousel-item v-for="item in features" :key="item.id" :src="item.img.url" transition="fade" reverse-transition="fade">
                            <v-layout style="height:100%;cursor: pointer;" column justify-end @click="onClick(item.url)">
                                <div class="bottom-info">
                                    <h3>{{item.name}}</h3>
                                    <span>联系方式: {{item.tel}}</span>
                                </div>
                            </v-layout>
                        </v-carousel-item>
                    </v-carousel>
                </resize-box>
            </v-layout>
            <v-subheader>全部经销商</v-subheader>
            <v-card>
                <v-data-table :headers="isMobile ? mobileHeader: headers" :items="businesses" hide-actions>
                    <template slot="items" slot-scope="props">
                        <td>
                            <a :href="props.item.url" target="_blank">{{props.item.name }}</a>
                        </td>
                        <td>{{ props.item.tel }}</td>
                        <td v-if="!isMobile">{{ props.item.description }}</td>
                    </template>
                    <v-layout slot="no-data" justify-center>
                        <p>暂时没有找到数据</p>
                    </v-layout>
                </v-data-table>
            </v-card>
        </v-container>
    </div>
</template>

<script>
import Hero from '@/components/hero.vue'
import resizeBox from '@/components/resizeBox.vue'
import { mapState } from "vuex";
import gql from 'graphql-tag';
export default {
    data() {
        return {
            slideIndex: null,
            slideHeight: '400px',
            businesses: [],
            headers: [
                { text: "商家名", value: "name" },
                { text: '联系方式', value: "tel" },
                { text: '简介', value: "description" },

            ],
            mobileHeader: [
                { text: "商家名", value: "name" },
                { text: '联系方式', value: "tel" },
            ]
        }
    },
    methods: {
        onClick(url) {
            window.open(url, "_blank");
        }
    },
    computed: {
        ...mapState(['isMobile']),
        features() {
            return this.businesses.filter(v => v.isFeatured)
        }
    },
    components: {
        Hero,
        resizeBox
    },
    apollo: {
        businesses: {
            query: gql`
            {
                businesses{
                    id
                    name
                    description
                    tel
                    url
                    img{
                    url
                    }
                    isFeatured
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
   padding-top: 1em;
   color: #fff;
   margin-bottom: 50px;
   text-align: center;
   background-color: rgba(0, 0, 0, .5)
}
</style>