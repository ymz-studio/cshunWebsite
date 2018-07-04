<template>
    <div>
        <v-parallax :src="require('assets/about/background-1.jpg')" class="hero">
            <v-layout column justify-center align-center>
                <h1>关于长顺</h1>
                <h2>为您提供最新, 最全面的长顺相关信息</h2>
            </v-layout>
        </v-parallax>
        <half-container>
            <span slot="title">概况简介</span>
            <img class="smart-img" slot="left" src="~assets/about/pic.jpg">
            <v-layout column justify-space-between slot="right" class="px-2">
                <h4>长顺县隶属中华人民共和国贵州省黔南布依族苗族自治州，县政府驻长寨镇，位于贵州省中南部，黔南州西部。长顺县总面积1543平方千米。县城距省城贵阳市84千米，至州府都匀市178千米，到安顺市85千米。辖5镇、1乡、1街道。总人口25.66万人（2015年），少数民族人口占56%，主要以布依族、苗族为主。长顺县山脉属苗岭山系，苗岭分水岭横亘县的北部，地势呈北高南低，地貌类型北部为丘原区，西部为丘陵区，中南部为岩溶中低山，东部为峰丛谷地，河流分属长江，珠江两大水系。工业有采煤、化肥、建材、饲料加工。农业以种植油菜为主，是黔中地区“粮仓”之一。2014年，全县地区生产总值完成41.02亿元，财政总收入完成5.44亿元，公共财政预算收入完成2.95亿元，城镇居民人均可支配收入完成20181元，农民人均可支配收入完成6780元。县内有杏王山、白云山、杜鹃湖等景点。</h4>
                <v-layout column justify-end class="mt-4">
                    <h3>地址：贵州省黔南布依族苗族自治州长顺县</h3>
                    <h3>电话：0854-6821133</h3>
                    <h3>网址：
                        <a>http://www.gzcsx.gov.cn/</a>
                    </h3>
                </v-layout>
            </v-layout>
        </half-container>
        <v-container grid-list-xl>
            <v-divider class="my-5"></v-divider>
            <v-layout wrap justify-space-around>
                <v-flex xs12 md3 lg2 v-for="(item,i) in grid" :key="i">
                    <v-layout row wrap align-center>
                        <v-flex xs4 md12>
                            <img class="smart-img" :class="{'px-5':!isMobile}" :src="item.src">
                        </v-flex>
                        <v-flex xs8 md12>
                            <h2>{{item.title}}</h2>
                            <p>{{item.text}}</p>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    data() {
        return {
            grid: [
                { title: '地理位置', src: require('assets/about/position-1.svg'), text: '长顺县位于贵州省中南部，黔南州西部。距省城贵阳市84千米，至州府都匀市178千米， 到安顺市85千米。城市中心点为东经106.45度，北纬26.03度。总面积1554.6平方千米，县城规模6.5平方千米。' },
                { title: '环境特点', src: require('assets/about/position-2.svg'), text: '长顺县属中亚热带季风湿润气候区，雨热同季，冬无严寒，夏无酷暑，年均温13.5-18.5℃，年极端最低气温为零下15.5℃，极端最高气温为40.7℃。相对湿度81%。无霜期275天，年降雨量1250-1400毫米。' },
                { title: '人口状况', src: require('assets/about/position-3.svg'), text: '截至2015年末，长顺县人口256559人，其中汉族103321人，少数民族153238人。分别占总人口的40.27%和59.72%，其中：汉、布依、苗3个民族是主体民族，在全县各乡缜均有分布。' }
            ]
        }
    },
    computed: {
        ...mapState(['isMobile'])
    }

}
</script>

<style lang="stylus" scoped>
.hero {
    min-height: 60vh;
    width: 100vw;
}
</style>