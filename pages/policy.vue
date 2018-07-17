<template>
  <div>
    <!-- news -->
    <v-container class="my-4">
      <v-layout justify-center align-center>
        <resizeBox>
          <v-carousel style="height:100%" class="slide" @input="newsChanged($event)">
            <v-carousel-item v-for="item in news" :key="item.title" :src="item.img" transition="fade" reverse-transition="fade">
            </v-carousel-item>
          </v-carousel>
        </resizeBox>
      </v-layout>
      <!-- news title -->
      <v-layout wrap align-center :justify-center="isMobile" class="px-4 py-4">
        <v-flex xs12 sm1 class="news-header text-xs-center" :class="isMobile ? 'bdd' : 'bdr' ">
          <h2>滚动新闻</h2>
        </v-flex>
        <v-flex xs12 sm8 class="news-meta px-4 py-2">
          <h2 class="text-sm-left text-xs-center">{{news[newsIndex].title}}</h2>
          <p class="text-sm-left text-xs-center">{{news[newsIndex].sub_title}}</p>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- posts -->
    <v-container fluid class="bg-grey has-border">
      <v-container>
        <v-tabs v-model="tabIndex" color="cyan" dark slider-color="yellow">
          <v-tab v-for="tab in tabs" :key="tab.title" ripple>
            {{tab.title}}
          </v-tab>
          <v-tab-item v-for="tab in tabs" :key="tab.title">
            <v-card flat>
              <v-card-text>
                <v-list>
                  <v-list-tile v-for="(item, index) in tab.posts" :key="index" avatar :href="item.href">
                    <v-list-tile-content>
                      <v-list-tile-title v-text="item.title"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-sub-title v-text="item.date" class="post-date"></v-list-tile-sub-title>
                  </v-list-tile>
                </v-list>
                <v-layout column justify-center align-center>
                  <v-flex>
                    <v-btn color="purple" style="color:white;">阅读更多</v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import resizeBox from "@/components/resizeBox";
export default {
  components: {
    resizeBox
  },
  data() {
    return {
      news: [
        {
          title: "今日新闻标题A",
          sub_title: "新闻副标题A....",
          img: require("assets/spots/jiaxiulou.jpg")
        },
        {
          title: "今日新闻标题B",
          sub_title: "新闻副标题B....",
          img: require("assets/spots/shengquangu.jpg")
        },
        {
          title: "今日新闻标题C",
          sub_title: "新闻副标题C....",
          img: require("assets/spots/fenghuangba.jpg")
        },
        {
          title: "今日新闻标题D",
          sub_title: "新闻副标题D....",
          img: require("assets/spots/jiaxiulou.jpg")
        }
      ],
      newsIndex: 0,
      tabIndex: 0,
      tabs: [
        {
          title: "扶贫政策",
          posts: [
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            }
          ]
        },
        {
          title: "新闻中心",
          posts: [
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            }
          ]
        },
        {
          title: "工作动态",
          posts: [
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            },
            {
              title: "Forrist dekls",
              date: "2018-06-48",
              href: "http://www.google.com"
            }
          ]
        }
      ]
    };
  },
  methods: {
    newsChanged(e) {
      this.newsIndex = e;
    }
  },
  computed: {
    ...mapState(["isMobile"])
  }
};
</script>

<style scoped>
.slide >>> .v-jumbotron__image {
  width: 100%;
  height: 100%;
}
.news-header {
  color: #333;
  min-width: 5rem;
  padding-right: 0.5rem;
}
.bdr {
  border-right: 1px solid rgba(0, 0, 0, 0.2);
}
.bdd {
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.news-header > h2 {
  font-weight: 500;
}
.news-meta {
  color: #333;
}
.news-meta > p {
  font-size: 18px;
  margin: 0;
}

.bg-grey {
  background-color: whitesmoke;
}
.has-border {
  border-top: 2px solid rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.post-date {
  width: inherit;
}
</style>
