<template>
  <div>
    <!-- news -->
    <v-container>
      <v-layout justify-center wrap fill-height>
        <v-flex xs12 sm8 md9>
          <resizeBox :rate="16/9">
            <v-carousel style="height:100%" class="slide" v-model="newsIndex" dark>
              <v-carousel-item v-for="(item, index) in news.edges" v-if="index<=3" :key="item.node.id"
                :src="imgs[index]" transition="fade" reverse-transition="fade">
                <!-- <v-layout column align-center justify-center class='bottom-info' v-if="!isMobile">
                  <h1 style="color:#F64547;">{{item.node.title}}</h1>
                  <h3 style="color:#333;">{{item.node.createdAt.substring(0, 10)}}</h3>
                </v-layout> -->
              </v-carousel-item>
            </v-carousel>
          </resizeBox>
        </v-flex>
        <v-flex xs12 sm4 md3 v-if="!isMobile">
          <v-layout column justify-space-around fill-height>
            <v-flex justify-space-around justify-center xs12 v-for="(item, index) in news.edges" v-if="index<=3"
              :key="item.node.id" class="news-tabs px-2" @mouseover="newsIndex = index"
              @click="openPost(item.node.id)" :class="index == newsIndex ? 'active' : null">
              <h2 :class="index == newsIndex ? 'active' : null">{{item.node.title}}</h2>
              <div class="news-tabs-date">{{item.node.createdAt.substring(0, 10)}}</div>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- news title -->
    <v-layout column align-center v-if="isMobile && news.edges[0]" class="py-3">
      <a>
        <h2>{{news.edges[newsIndex].node.title}}</h2>
      </a>
      <h3>{{news.edges[0] ? news.edges[newsIndex].node.createdAt.substring(0, 10):''}}</h3>
    </v-layout>
    <!-- posts -->
    <v-container fluid class="bg-grey has-border">
      <v-container>
        <v-tabs v-model="tabIndex" color="cyan" dark slider-color="yellow">
          <!-- tabs -->
          <v-tab ripple>
            扶贫政策
          </v-tab>
          <v-tab ripple>
            新闻中心
          </v-tab>

          <!-- policy -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-list>
                  <v-list-tile v-for="(item) in policy.edges" :key="item.node.id" avatar @click="openPost(item.node.id)">
                    <v-list-tile-content>
                      <v-list-tile-title v-text="item.node.title"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-sub-title v-text="item.node.createdAt.substring(0, 10)" class="post-date"></v-list-tile-sub-title>
                  </v-list-tile>
                </v-list>
                <v-layout column justify-center align-center>
                  <v-flex>
                    <v-btn color="purple" style="color:white;" v-if="tabs.policy.skip+tabs.policy.first <= policy.aggregate.count"
                      @click="fetchMore('policy')" :loading="$apollo.queries.policy.loading">阅读更多</v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-tab-item>

          <!-- news -->
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-list>
                  <v-list-tile v-for="(item) in news.edges" :key="item.node.id" avatar @click="openPost(item.node.id)">
                    <v-list-tile-content>
                      <v-list-tile-title v-text="item.node.title"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-sub-title v-text="item.node.createdAt.substring(0, 10)" class="post-date"></v-list-tile-sub-title>
                  </v-list-tile>
                </v-list>
                <v-layout column justify-center align-center>
                  <v-flex>
                    <v-btn color="purple" style="color:white;" v-if="tabs.news.skip+tabs.news.first <= news.aggregate.count"
                      @click="fetchMore('news')" :loading="$apollo.queries.news.loading">阅读更多</v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
        <!-- post dialog -->
        <v-dialog v-model="current_post.focus" :fullscreen="isMobile" width="70%">
          <v-card tile v-if="current_post_data.edges[0]">
            <v-toolbar flat class="card-bar">
              <v-btn icon @click="current_post.focus = false">
                <v-icon>arrow_back</v-icon>
              </v-btn>
              <v-toolbar-title>{{current_post_data.edges[0].node.title}}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn flat :loading="$apollo.queries.current_post_data.loading"></v-btn>
            </v-toolbar>
            <v-card-text v-if="current_post_data.edges[0] && !$apollo.queries.current_post_data.loading"
              class="card-text">
              <h2 class="text-xs-center">{{current_post_data.edges[0].node.title}}</h2>
              <h3 class="text-xs-center">作者：{{current_post_data.edges[0].node.author}}</h3>
              <p class="text-xs-center">{{current_post_data.edges[0].node.createdAt.substring(0, 10)}}</p>
              <div v-html="current_post_data.edges[0].node.content"></div>
            </v-card-text>
            <v-card-text v-else>
              正在加载文章内容
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import resizeBox from "@/components/resizeBox";
import gql from "graphql-tag";
export default {
  components: {
    resizeBox
  },
  data() {
    return {
      newsIndex: 0,
      tabIndex: 0,
      tabs: {
        policy: {
          skip: 0,
          first: 15
        },
        news: {
          skip: 0,
          first: 15
        }
      },
      policy: {
        aggregate: {
          count: 0
        },
        edges: [
          {
            node: {
              id: "",
              title: "",
              category: "",
              author: "",
              content: "",
              createdAt: ""
            }
          }
        ]
      },
      news: {
        aggregate: {
          count: 0
        },
        edges: [
          {
            node: {
              id: "",
              title: "",
              category: "",
              author: "",
              content: "",
              createdAt: ""
            }
          }
        ]
      },
      current_post: {
        id: "",
        focus: false
      },
      current_post_data: {
        edges: [
          {
            node: {
              id: "",
              title: "",
              category: "",
              author: "",
              content: "",
              createdAt: ""
            }
          }
        ]
      },
      imgs: [
        require("assets/spots/travel/dixi.jpg"),
        require("assets/spots/travel/baiyun.jpg"),
        require("assets/spots/travel/huishui.jpg"),
        require("assets/spots/travel/dujuan.jpg")
      ]
    };
  },
  methods: {
    newsChanged(e) {
      this.newsIndex = e;
    },
    openPost(id) {
      this.$apollo.queries.current_post_data.skip = false;
      this.current_post.id = id;
      this.current_post.focus = true;
    },
    fetchMore(type) {
      if (type == "policy") {
        this.tabs.policy.skip += this.tabs.policy.first;
        this.$apollo.queries.policy.fetchMore({
          variables: {
            skip: this.tabs.policy.skip
          },
          updateQuery: function(oldResult, { fetchMoreResult }) {
            console.log(oldResult);
            console.log(fetchMoreResult);
            fetchMoreResult.policy.edges = oldResult.policy.edges.concat(
              fetchMoreResult.policy.edges
            );
            return fetchMoreResult;
          }
        });
      } else {
        this.tabs.news.skip += this.tabs.news.first;
        this.$apollo.queries.news.fetchMore({
          variables: {
            skip: this.news.policy.skip
          },
          updateQuery: function(oldResult, { fetchMoreResult }) {
            console.log(oldResult);
            console.log(fetchMoreResult);
            fetchMoreResult.news.edges = oldResult.news.edges.concat(
              fetchMoreResult.news.edges
            );
            return fetchMoreResult;
          }
        });
      }
    }
  },
  computed: {
    ...mapState(["isMobile"])
  },
  apollo: {
    policy: {
      query: gql`
        query ListPolicy(
          $skip: Int!
          $first: Int!
          $where: PostWhereInput!
          $orderBy: PostOrderByInput
        ) {
          policy: posts(
            skip: $skip
            where: $where
            orderBy: $orderBy
            first: $first
          ) {
            aggregate {
              count
            }
            edges {
              node {
                id
                title
                category
                author
                createdAt
              }
            }
          }
        }
      `,
      variables() {
        return {
          skip: 0,
          first: 15,
          where: {
            category: "POLICY"
          },
          orderBy: "updatedAt_DESC"
        };
      }
    },
    news: {
      query: gql`
        query ListPolicy(
          $skip: Int!
          $first: Int!
          $where: PostWhereInput!
          $orderBy: PostOrderByInput
        ) {
          news: posts(
            skip: $skip
            where: $where
            orderBy: $orderBy
            first: $first
          ) {
            aggregate {
              count
            }
            edges {
              node {
                id
                title
                category
                author
                createdAt
              }
            }
          }
        }
      `,
      variables() {
        return {
          skip: 0,
          first: 15,
          where: {
            category: "NEWS"
          },
          orderBy: "updatedAt_DESC"
        };
      }
    },
    current_post_data: {
      query: gql`
        query GetCurrentPost($where: PostWhereInput!) {
          current_post_data: posts(where: $where) {
            edges {
              node {
                title
                author
                createdAt
                content
              }
            }
          }
        }
      `,
      variables() {
        return {
          where: {
            id: this.current_post.id || ""
          }
        };
      }
    }
  },
  mounted() {
    this.newsIndex++;
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
  color: #333;
  padding: 50px;
  text-align: center;
}

.v-card__text img {
  max-width: 100%;
}

.card-bar {
  position: fixed;
}
.card-text {
  padding-top: 60px;
}
.card-text img {
  max-width: 100%;
}

.news-tabs {
  padding: 5px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}
.news-tabs.active {
  border-left: 5px solid rgb(245, 92, 94);
}
.news-tabs h2 {
  font-size: 1.3rem;
  color: #f64547;
  transition: all 0.15s ease;
  font-weight: 500;
}
.news-tabs h2.active {
  font-weight: 800;
}
.news-tabs-date {
  float: right;
  font-size: 12px;
  color: #333;
}
</style>
