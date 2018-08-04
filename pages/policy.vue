<template>
  <div>
    <!-- news -->
    <v-layout justify-center align-center>
      <resizeBox :rate="20/9">
        <v-carousel style="height:100%" class="slide" @input="newsChanged($event)">
          <v-carousel-item v-for="item in news" :key="item.title" :src="item.img" transition="fade" reverse-transition="fade">
            <v-layout column align-center justify-center class='bottom-info' v-if="!isMobile">
              <h2>{{item.title}}</h2>
              <h3>{{item.sub_title}}</h3>
            </v-layout>
          </v-carousel-item>
        </v-carousel>
      </resizeBox>
    </v-layout>
    <!-- news title -->
    <v-layout column align-center v-if="isMobile" class="py-3">
      <a>
        <h2>{{news[newsIndex].title}}</h2>
      </a>
      <h3>{{news[newsIndex].sub_title}}</h3>
    </v-layout>
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
.bottom-info {
  height: 100%;
  color: #fff;
  padding: 50px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
