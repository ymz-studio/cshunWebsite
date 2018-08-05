<template>
  <div>
    <hero :src="require('assets/consultant/hero.jpg')" title="专家咨询" subTitle="信息广泛，全方面助力您的生产"></hero>
    <!-- experts -->
    <v-container fluid class="bg-grey has-border">
      <v-container>
        <h2 class="text-xs-center">著名专家</h2>
        <v-layout wrap>
          <template v-for="n in 8">
            <v-flex :key="n" xs12 md4 class="px-2 py-2">
              <v-card>
                <v-card-media src="https://cdn.vuetifyjs.com/images/cards/desert.jpg" height="200px"></v-card-media>

                <v-card-title primary-title>
                  <div>
                    <h3 class="headline mb-0">专家名字</h3>
                    <div>这个专家的介绍</div>
                  </div>
                </v-card-title>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-container>
    </v-container>
    <!-- questions -->
    <v-container fluid class="bg-white">
      <v-container>
        <h2 class="text-xs-center">精选问题</h2>
        <v-layout wrap>
          <v-flex xs12 sm6 class="px-2 py-2" v-for="item in split_questions" :key="item.type">
            <v-list two-line>
              <v-subheader>
                {{item.type}}：
              </v-subheader>
              <template v-for="(question, index) in item.items" v-if="index  < 3">
                <v-list-tile :key="question.id" @click="open_question(question)">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="question.title"></v-list-tile-title>
                    <v-list-tile-sub-title>
                      <span style="color:#333">{{question.content.substring(0, 10)}}...</span>
                      <span>{{question.answers.length}}个回答</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider :key="index"></v-divider>
              </template>
            </v-list>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
    <!-- ask question -->
    <v-container fluid class="bg-grey has-border">
      <v-container>
        <v-layout justify-center align-center>
          <v-flex xs12 sm8>
            <v-form v-model="question.valid">
              <v-text-field v-model="question.title" :rules="question_rule.title" label="问题标题"
                required></v-text-field>
              <v-text-field v-model="question.content" :rules="question_rule.content" label="问题内容"
                required></v-text-field>
              <v-btn :disabled="!question.valid" color="primary" @click="createQA">提交问题</v-btn>
              <v-btn flat color="primary" @click="question.title = question.content = ''">清除内容</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
    <!-- atricle -->
    <v-container fluid class="bg-white">
      <v-container>
        <h2 class="text-xs-center py-4">通用农业技术</h2>
        <v-layout column>
          <v-flex xs12>
            <v-data-table :headers="headers" :items="posts.edges" hide-actions class="elevation-1"
              :rows-per-page-text="'每页显示行数'" :no-data-text="'暂时没有文章'">
              <template slot="items" slot-scope="props">
                <tr @click="openPost(props.item)">
                  <td>{{ props.item.node.title }}</td>
                  <td>{{ props.item.node.author }}</td>
                  <td class="text-xs-right">{{ props.item.node.createdAt.substring(0, 10) }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
    <!-- article dialog -->
    <v-dialog v-model="show_post.focus" :fullscreen="isMobile" width="70%">
      <v-card tile v-if="current_post.edges[0]">
        <v-toolbar flat class="card-bar">
          <v-btn icon @click="show_post.focus = false">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title>{{current_post.edges[0].node.title}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat :loading="$apollo.queries.current_post.loading"></v-btn>
        </v-toolbar>
        <v-card-text v-if="current_post.edges[0] && !$apollo.queries.current_post.loading"
          class="card-text">
          <h2 class="text-xs-center">{{current_post.edges[0].node.title}}</h2>
          <h3 class="text-xs-center">作者：{{current_post.edges[0].node.author}}</h3>
          <p class="text-xs-center">{{current_post.edges[0].node.createdAt.substring(0, 10)}}</p>
          <div v-html="current_post.edges[0].node.content"></div>
        </v-card-text>
        <v-card-text v-else>
          正在加载文章内容
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- question dialog -->
    <no-ssr>
      <QADialog :editable="false" :enable="question_detail.status" :qadata="question_detail"
        @close="question_detail.status = false;" v-if="question_detail.status" />
    </no-ssr>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Hero from "@/components/hero";
import FileUpload from "@/components/file-upload";
import gql from "graphql-tag";
import QADialog from "@/components/experts/qa-board";

export default {
  components: {
    Hero,
    FileUpload,
    QADialog
  },
  computed: {
    ...mapState(["isMobile"]),
    animal_question() {
      return this.questions.filter(item => {
        return item.category == "ANIMAL_FARMING";
      });
    },
    fruit_question() {
      return this.questions.filter(item => {
        return item.category == "FRUIT_CULTIVATION";
      });
    },
    planting_question() {
      return this.questions.filter(item => {
        return item.category == "PLANTING";
      });
    },
    other_question() {
      return this.questions.filter(item => {
        return item.category == "OTHERS";
      });
    },
    split_questions() {
      return [
        { type: "牲口养殖", items: this.animal_question },
        { type: "蔬果培育", items: this.fruit_question },
        { type: "农物栽种", items: this.planting_question },
        { type: "其他", items: this.other_question }
      ];
    }
  },
  data() {
    return {
      question: {
        valid: false,
        title: "",
        content: ""
      },
      question_rule: {
        title: [v => !!v || "需要标题"],
        content: [v => !!v || "需要内容"]
      },
      headers: [
        {
          text: "文章标题",
          value: "title",
          sortable: false
        },
        {
          text: "作者",
          value: "author",
          sortable: false
        },
        {
          text: "日期",
          value: "createdAt",
          sortable: false
        }
      ],
      posts: {},
      current_post: {
        edges: [
          {
            node: {
              title: "",
              author: "",
              content: ""
            }
          }
        ]
      },
      show_post: {
        focus: false,
        id: ""
      },
      questions: [],
      question_detail: {
        status: false,
        title: "",
        content: "",
        id: "",
        category: ""
      }
    };
  },
  methods: {
    open_question(item) {
      this.question_detail.title = item.title;
      this.question_detail.content = item.content;
      this.question_detail.id = item.id;
      this.question_detail.category = item.category;
      this.question_detail.status = true;
    },
    openPost(item) {
      this.show_post.id = item.node.id;
      this.show_post.focus = true;
    },
    createQA() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation CreateQuestion($data: QuestionCreateInput!) {
              createQuestion(data: $data) {
                id
              }
            }
          `,
          variables: {
            data: {
              title: this.question.title,
              content: this.question.content
            }
          }
        })
        .then(data => {
          this.question.title = "";
          this.question.content = "";
          alert("提交问题成功");
        })
        .catch(err => {
          alert("创建问题失败");
          console.log(err);
        });
    }
  },
  apollo: {
    posts: {
      query: gql`
        query ListPost($where: PostWhereInput!) {
          posts(where: $where) {
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
          where: {
            category: "AGRICULTURAL_TECH"
          }
        };
      }
    },
    current_post: {
      query: gql`
        query GetPost($where: PostWhereInput!) {
          current_post: posts(where: $where) {
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
            id: this.show_post.id || ""
          }
        };
      }
    },
    questions: {
      query: gql`
        query ListQuestions {
          questions {
            id
            title
            content
            category
            answers {
              id
            }
          }
        }
      `,
      update(data) {
        console.log(data);
        return data.questions.filter(item => {
          return item.answers[0]; //过滤没有回答的问题
        });
      }
    }
  }
};
</script>

<style scoped>
.bg-white {
  background: white !important;
}
.bg-grey {
  background-color: whitesmoke;
}
.has-border {
  border-top: 2px solid rgba(0, 0, 0, 0.1);
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
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
</style>
