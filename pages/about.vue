<template>
  <div>
    <hero :src="require('assets/about/background-2.jpg')"></hero>

    <hr
      style="margin-top:15px;border:none;margin-left:7.5%;width:85%;height:3px;background-color:rgb(205,0,3);"
    >
    <hr
      style="margin-top:12px;border:none;margin-left:7.5%;width:85%;height:8px;background-color:rgb(205,0,3);"
    >

    <div class="container">
      <div v-for="(item, i ) in block" :key="i" class="containerElement">
        <div class="containerTitle">{{item.title}}</div>
        <hr style="width:90%;background-color:rgb(203,0,3);height:1px;border:none;">
        <div class="containerContent" v-for="(con, m) in item.content" :key="m">
          <a class="containerUrl" :href="con.src">{{con.title}}</a>
        </div>
      </div>
    </div>
    <!-- <half-container>
            <span slot="title">概况简介</span>
            <img class="smart-img" slot="left" src="~assets/about/pic.jpg">
            <v-layout column justify-space-between slot="right" class="px-2">
                <p>长顺县隶属中华人民共和国贵州省黔南布依族苗族自治州，县政府驻长寨镇，位于贵州省中南部，黔南州西部。长顺县总面积1543平方千米。县城距省城贵阳市84千米，至州府都匀市178千米，到安顺市85千米。辖5镇、1乡、1街道。总人口25.66万人（2015年），少数民族人口占56%，主要以布依族、苗族为主。长顺县山脉属苗岭山系，苗岭分水岭横亘县的北部，地势呈北高南低，地貌类型北部为丘原区，西部为丘陵区，中南部为岩溶中低山，东部为峰丛谷地，河流分属长江，珠江两大水系。工业有采煤、化肥、建材、饲料加工。农业以种植油菜为主，是黔中地区“粮仓”之一。2014年，全县地区生产总值完成41.02亿元，财政总收入完成5.44亿元，公共财政预算收入完成2.95亿元，城镇居民人均可支配收入完成20181元，农民人均可支配收入完成6780元。县内有杏王山、白云山、杜鹃湖等景点。</p>
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
    </v-container>-->
  </div>
</template>

<script>
import { mapState } from "vuex";
import Hero from "@/components/hero.vue";

export default {
  components: {
    Hero
  },
  data() {
    return {
      grid: [
        {
          title: "地理位置",
          src: require("assets/about/position-1.svg"),
          text:
            "长顺县位于贵州省中南部，黔南州西部。距省城贵阳市84千米，至州府都匀市178千米， 到安顺市85千米。城市中心点为东经106.45度，北纬26.03度。总面积1554.6平方千米，县城规模6.5平方千米。"
        },
        {
          title: "环境特点",
          src: require("assets/about/position-2.svg"),
          text:
            "长顺县属中亚热带季风湿润气候区，雨热同季，冬无严寒，夏无酷暑，年均温13.5-18.5℃，年极端最低气温为零下15.5℃，极端最高气温为40.7℃。相对湿度81%。无霜期275天，年降雨量1250-1400毫米。"
        },
        {
          title: "人口状况",
          src: require("assets/about/position-3.svg"),
          text:
            "截至2015年末，长顺县人口256559人，其中汉族103321人，少数民族153238人。分别占总人口的40.27%和59.72%，其中：汉、布依、苗3个民族是主体民族，在全县各乡缜均有分布。"
        }
      ],
      block: [
        {
          title: "重要讲话",
          content: [
            {
              title: "习近平论“三农”",
              src: "http://jhsjk.people.cn/article/31072879"
            },
            {
              title: "习近平谈“两不愁三保障”",
              src: "http://jhsjk.people.cn/article/31035837"
            },
            {
              title: "习近平谈精准扶贫：开对了“药方子”，才能拔掉“穷根子”",
              src: "http://jhsjk.people.cn/article/30759690"
            },
            {
              title: "习近平谈摆脱贫困：扶贫必扶智，治贫先治愚",
              src: "http://jhsjk.people.cn/article/30329647"
            },
            {
              title: "习近平谈扶贫开发工作：引导社会扶贫重心下沉",
              src: "http://jhsjk.people.cn/article/30306848"
            }
          ]
        },
        {
          title: "重要会议",
          content: [
            {
              title:
                "习近平：把稳方向突出实效全力攻坚 坚定不移推动落实重大改革举措（中央全面深化改革委员会第七次会议）",
              src: "http://cpc.people.com.cn/n1/2019/0320/c64094-30984406.html"
            },
            {
              title:
                "中央农村工作会议在京召开 习近平对做好“三农”工作作出重要指示 李克强提出要求",
              src: "http://cpc.people.com.cn/n1/2018/1230/c64036-30496740.html"
            },
            {
              title:
                "习近平：把乡村振兴战略作为新时代“三农”工作总抓手（中共中央政治局第八次集体学习）",
              src: "http://cpc.people.com.cn/n1/2018/0923/c64094-30309476.html"
            },
            {
              title: "习近平：贯彻新发展理念，建设现代化经济体系（十九大）",
              src: "http://jhsjk.people.cn/article/29635032"
            },
            {
              title: "总书记两会声音",
              src: "http://jhsjk.people.cn/article/29145526"
            }
          ]
        },
        {
          title: "重要考察",
          content: [
            {
              title:
                "不忘初心，重整行装再出发——习近平总书记在江西调研并主持召开推动中部地区崛起工作座谈会纪实",
              src: "http://jhsjk.people.cn/article/31100693"
            },
            {
              title:
                "习近平：脱贫致富不能等靠要，既然党的政策好，就要努力向前跑 （重庆调研）",
              src: "http://jhsjk.people.cn/article/31032941"
            },
            {
              title:
                "习近平：坚持新发展理念打好“三大攻坚战” 奋力谱写新时代湖北发展新篇章",
              src: "http://jhsjk.people.cn/article/29957532"
            },
            {
              title:
                "记习近平总书记看望四川凉山地区群众并主持召开打好精准脱贫攻坚战座谈会",
              src: "http://jhsjk.people.cn/article/29824406"
            },
            {
              title: "习近平总书记在山西深度贫困地区调研脱贫攻坚",
              src: "http://jhsjk.people.cn/article/29359853"
            }
          ]
        }
      ]
    };
  },
  computed: {
    ...mapState(["isMobile"])
  }
};
</script>

<style lang="stylus" scoped>
.container {
  display: flex;
  flex-flow: row nowrap;
  width: 90%;
}

.containerElement {
  width: 33.3333%;
}

.containerTitle {
  font-weight: bold;
  color: rgb(203, 0, 3);
  font-size: 30px;
}

.containerContent {
  width: 85%;
  padding-top: 24px;
}

.containerUrl {
  color: black;
}
</style>