<template>
  <div>
    <!-- slides -->
    <v-layout justify-center align-center>
      <resizeBox :rate="19/9">
        <v-carousel style="height:100%" class="slide" @input="slideChanged($event)">
          <v-carousel-item v-for="item in slides" :key="item.name" :src="item.src" transition="fade" reverse-transition="fade">
            <v-layout justify-center column align-center class="slide-info" v-if="!isMobile">
              <h3>{{item.name}}</h3>
              <p class="px-4">{{item.description}}</p>
            </v-layout>
          </v-carousel-item>
        </v-carousel>
      </resizeBox>
    </v-layout>
    <!-- backup descirption -->
    <v-layout column justify-center align-center class="px-4 py-4" v-if="isMobile">
      <h3 class="text-xs-center">{{slides[slideIndex].name}}</h3>
      <p class="text-xs-center">{{slides[slideIndex].description}}</p>
    </v-layout>

    <!-- spots -->
    <v-container fluid class="bg-grey has-border">
      <v-layout justify-center align-center class="py-4">
        <h2 class="text-xs-center">旅游导览</h2>
      </v-layout>
      <v-layout justify-center align-center wrap>
        <template v-for="(item, index) in spots">
          <v-flex xs12 sm6 class="px-1 py-1" :key="item.name" @click.stop="spot_focus = true; spot_index = index">
            <div class="travel-card">
              <img :src="item.url" class="travel-img">
              <v-layout column justify-end align-end wrap class="travel-card-content">
                <h1 :class="item.class">DAY {{index + 1}}</h1>
                <h2 :class="item.class">{{item.name}}</h2>
                <p :class="item.class">{{item.description}}</p>
                <transition name="fade">
                  <div class="wrapper"></div>
                </transition>
              </v-layout>
            </div>
          </v-flex>
        </template>
        <!-- Detail dialog -->
        <v-dialog :fullscreen="isMobile" v-model="spot_focus" width="60%">
          <v-card tile>
            <v-card-title>
              <h3>{{spots[spot_index].name}}</h3>
            </v-card-title>
            <v-card-text>
              <p v-for="text in spots[spot_index].detail" :key="text">{{text}}</p>
            </v-card-text>
            <v-card-actions v-if="isMobile">
              <v-btn @click="spot_focus = false">关闭</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-container>

    <!-- foods -->
    <v-container :fluid="isMobile" grid-list-xl>
      <v-layout justify-center align-center>
        <h2 class="text-xs-center">必吃美食</h2>
      </v-layout>
      <v-layout wrap>
        <v-flex v-for="n in 6" :key="n" xs12 sm6 md4>
          <v-card>
            <v-card-media v-if="item.img" :src="item.img.url" height="200px"></v-card-media>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{item.name}}</h3>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- hotels -->
    <div class="bg-grey has-border" fluid>
      <v-container :fluid="isMobile" grid-list-xl>
        <v-layout justify-center align-center>
          <h2 class="text-xs-center">酒店信息</h2>
        </v-layout>
        <v-layout justify-center align-center wrap>
          <v-flex v-for="(item, n) in hotels" :key="item.id" xs12 sm6 md4 class="px-2 py-2">
            <v-card>
              <v-card-media :src="require('assets/spots/hotel.jpg')" height="200px"></v-card-media>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{item.name}}</h3>
                </div>
              </v-card-title>
              <v-card-text class="hotel-content">
                <p>地址：{{item.address}}</p>
                <p>网址：{{item.url}}</p>
                <p>评价：{{item.score}}</p>
                <v-chip v-for="x in 2" :key="x" class="hotel-content-chip">
                  <v-avatar>
                    <v-icon style="color:white;">stars</v-icon>
                  </v-avatar>
                  大床房：￥{{(x + 1)*200}}
                </v-chip>
                <v-chip v-for="house in item.houses" :key="house.id" class="hotel-content-chip">
                  <v-avatar>
                    <v-icon style="color:white;">stars</v-icon>
                  </v-avatar>
                  {{house.name}}：￥{{house.price}}
                </v-chip>
              </v-card-text>
              <v-divider/>
              <v-card-actions>
                <v-btn flat color="purple" @click="hotel_viewDetail(n)">了解详情</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          <!-- Detail dialog -->
          <v-dialog v-model="hotel_focus" width="60%">
            <v-card tile>
              <v-card-title>
                <h3>{{hotels[hotel_detail_index].name}}</h3>
              </v-card-title>
              <v-card-text>
                <p>{{hotels[hotel_detail_index].introduction}}</p>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import resizeBox from "@/components/resizeBox";
import MyDialog from "@/components/dialog";
import gql from "graphql-tag";
export default {
  components: {
    resizeBox,
    MyDialog
  },
  data() {
    return {
      slides: [
        {
          name: "凤凰坝",
          description:
            "凤凰坝生态农业体验园建设以长顺夜郎文化、长顺高钙苹果、紫王葡萄为依托，打造一个集民族文化、现代农业产业、乡村旅游、休闲观光、四季采摘等为一体的综合性现代农业生态休闲观光园。",
          src: require("assets/spots/fenghuangba.jpg")
        },
        {
          name: "神泉谷",
          description:
            "神泉谷集原生态的山、水、瀑、溪为一体，谷内茂林修竹，翠碧晶莹，葱岭峻峭，如诗如画。",
          src: require("assets/spots/shengquangu.jpg")
        },
        {
          name: "甲秀楼",
          description:
            "甲秀楼在贵州省贵阳市城南的南明河上，以河中一块巨石为基而建。始建于明，后楼毁重建，改名“来凤阁”。",
          src: require("assets/spots/jiaxiulou.jpg")
        },
      ],
      slideIndex: 0,
      spots: [
        {
          name: "地戏—广顺夜郎故地",
          description:
            "广顺古镇已有2000多年的历史，主要以神秘的夜朗文化为主要特色",
          detail: [
            "长顺县马路乡屯堡地戏表演内容以“家将书”（岳家将、杨家将、薛家将、狄家将等）为主，\
            唱词有固定的祖传脚本，唱胜不唱败，注重表现忠义、向上的精神，充满阳刚之气。",
            "广顺古镇已有2000多年的历史，主要以神秘的夜朗文化为主要特色。广顺古镇为贵州八大古镇之一，\
            2000多年前曾为古夜郎国的故都，著名景点有占地5平方公里的古城遗址、\
            古墓群、神仙洞新旧石器时代古人类遗址、写字岩、道佛合一的广东福寺、民族英雄但名伦故居等等。"
          ],
          url: require("assets/spots/travel/dixi.jpg"),
          class: "font-white"
        },
        {
          name: "杜鹃湖",
          description: "春天姹紫嫣红，秋日枫林似火",
          url: require("assets/spots/travel/dujuan.jpg"),
          detail: [
            "杜鹃湖全长7.4公里，湖面88万平方米，水深1 5一40米，库容1339万立方米，呈\
            树枝状展布，港汉幽深，四周层峦叠翠，植被良好，杜鹃、杨梅、映山红林是景区的主要特色。",
            "每当春暧季节，沿湖两岸杜鹃盛开，遍地姹紫嫣红，杨梅叶绿繁茂，掩映着红果垒垒，清香四益，映山红怒放，与毛栗树，杂树交相斗艳，苍松蔽日\
            红绿相间，泛舟湖中观赏杜鹃、杨梅、情趣盎然。秋天则枫林似火！与湖水相映，如红霞满天，海中蓬莱。有“霜叶红于二月花”的逸趣。"
          ],
          class: "font-white"
        },
        {
          name: "白云山—翁贵造纸作坊",
          description: "在西南佛教名山感受历史的沧桑与厚重",
          url: require("assets/spots/travel/baiyun.jpg"),
          detail: [
            "白云山在长顺县广顺东20公里。白云山是西南四大佛教名山之一，在这里，您能感到历史的沧桑与厚重。相传1402年“靖难之变”，明建文帝逊国逃至西南，由滇入黔后居此，成为长顺白云山白云寺的开山始祖。白云山上古木参天，建筑宏伟，层峦迭障，万山环绕。徐霞客逝世前三年，曾到白云山进行历时三天的旅游考察，曾写下《游记》。",
            "造纸术是我国四大发明之一，长顺县翁贵古法造纸在传承中国传统文化方面起着重要作用。相传这种造纸技艺继承了蔡伦的发明，在每年的农历五月二十七日，翁贵古法造纸单位、造纸人家都耍举行祭奠蔡伦的仪式。"
          ],
          class: "font-white"
        },
        {
          name: "惠水—青岩",
          description: "贵州著名的稻粟之地，桔果之乡；600多年历史古镇",
          url: require("assets/spots/travel/huishui.jpg"),
          detail: [
            "惠水县隶属于贵州省黔南布依族苗族自治州。位于贵州省中南部，北邻贵阳，西及安顺，县域东西宽72公里，南北长68公里，少数民族占58%。惠水自五代起设南宁州，宋代置“八番”地，明代建程番府，定番府，自今已有一千余年的历史。世居在这块土地上的布依，苗，汉，毛南，壮，彝，水，回等民族，经世代开发，将惠水建设成为贵州著名的稻粟之地，桔果之乡。",
            "青岩古镇在贵阳城南约25公里处。它有600多年的历史。青岩，本是山名，因山崖呈黛青色，故名。青岩古镇的兴起，和古代的驻军屯田有直接的关系。明洪武十一年（公元1378年），为了加强对边疆各少数民族地区的统治，贵州各地开设屯堡。"
          ],
          class: "font-white"
        }
      ],
      spot_focus: false,
      spot_index: 0,
      foods: [{ id: "", name: "", img: { url: "" } }],
      hotels: [
        {
          id: "",
          name: "",
          address: "",
          houses: [
            {
              name: "",
              prise: 0
            }
          ],
          url: "",
          introduction: ""
        }
      ],
      hotel_focus: false,
      hotel_detail_index: 0
    };
  },
  computed: {
    ...mapState(["isMobile"])
  },
  methods: {
    slideChanged(e) {
      this.slideIndex = e;
    },
    hotel_viewDetail(n) {
      this.hotel_detail_index = n;
      this.hotel_focus = true;
    }
  },
  apollo: {
    foods: {
      query: gql`
        {
          foods {
            id
            name
            img {
              url
            }
          }
        }
      `
    },
    hotels: {
      query: gql`
        {
          hotels {
            id
            name
            address
            url
            img {
              url
            }
            introduction
            score
            houses {
              id
              name
              price
            }
          }
        }
      `
    }
  },
  mounted() {
    console.log(this.hotels);
  }
};
</script>

<style scoped>
.slide >>> .v-jumbotron__image {
  width: 100%;
  height: 100%;
}
.slide-info {
  height: 100%;
}
.slide-info > * {
  width: 100%;
  padding: 1em 0;
  color: #fff;
  margin-bottom: 50px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.4);
}
.slide-info > h3 {
  position: absolute;
  top: 0;
}
.slide-info > p {
  position: absolute;
  bottom: 0;
}
.bg-grey {
  background-color: whitesmoke;
}
.has-border {
  border-top: 2px solid rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.travel-card {
  transition: all 0.5s ease;
  position: relative;
  height: 30rem;
  background-size: cover;
  background-position: center;
  border-radius: 2px;
  box-shadow: 0 0 2px grey;
  overflow: hidden;
  cursor: pointer;
}
.travel-card:hover {
  box-shadow: 0 0 10px grey;
}
.travel-card-content {
  text-align: right;
  position: absolute;
  bottom: 0;
  right: 0;
  text-shadow: 0 0 4px #555;
  width: 100%;
}
.travel-img{
  position: absolute;
  top: 0;
  left: 0;
  width: auto;
  height: 100%;
}
.travel-card-content h1 {
  font-weight: 300;
}
.travel-card-content h2 {
  line-height: 3rem;
}
.travel-card-content p {
  font-size: 20px;
}
.travel-card-content .wrapper {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1;
  position: absolute;
}
.font-black {
  color: #333;
  z-index: 2;
}
.font-white {
  color: white;
  z-index: 2;
  margin-right: 5px;
}

.hotel-content {
  padding-top: 2px;
}
.hotel-content > p {
  margin: 0;
  color: #999;
}
.hotel-content-chip {
  background-color: rgb(255, 168, 0);
  color: white;
  margin-left: 0;
  margin-right: 0.5rem;
}
</style>
