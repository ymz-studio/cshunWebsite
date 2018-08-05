<template>
  <v-dialog persistent v-model="enable" :fullscreen="isMobile" width="70%">
    <v-card tile>
      <!-- question metadata -->
      <v-toolbar extended>
        <v-btn :loading="this.loading" icon @click="$emit('close')">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title v-if="!editable">{{my_data.title}}</v-toolbar-title>
        <v-toolbar-title v-else style="padding-top:20px;">
          <v-text-field v-model="my_data.title" :rules="question_rule.title" single-line></v-text-field>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- save metadata -->
        <v-btn icon v-if="editable" @click="updateQuestion">
          <v-icon color="blue">save</v-icon>
        </v-btn>
        <div slot="extension" style="height:80px;width:100%">
          <p v-if="!editable">{{my_data.content}}</p>
          <v-form v-else>
            <v-text-field v-model="my_data.content" :rules="question_rule.content" label="问题内容"
              style="width:100%;"></v-text-field>
            <v-select :items="qa_schema" label="分类" item-text="name" item-value="value" v-model="my_data.category"></v-select>
          </v-form>
        </div>
      </v-toolbar>
      <!-- answers -->
      <v-card color="blue">
        <v-container fluid grid-list-lg>
          <v-layout wrap>
            <v-flex xs12>
              <v-progress-linear :indeterminate="true" v-show="$apollo.queries.answers.loading"
                color="warning" style="position:absolute;top:0;"></v-progress-linear>
            </v-flex>
            <!-- answer list -->
            <v-flex xs12 v-for="item in answers" :key="item.id">
              <v-card class="answer-card">
                <v-card-title>
                  <h3>{{item.title}}</h3>
                </v-card-title>
                <v-card-text>
                  <div>{{item.content}}</div>
                </v-card-text>
                <!-- edit answer -->
                <v-card-actions v-if="editable">
                  <span class="answer-author">作者：{{item.author}}</span>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="editAnswer(item)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                  <v-btn icon @click="deleteAnswer(item)">
                    <v-icon color="red">delete</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
            <!-- answer btn -->
            <v-flex xs12 v-if="editable">
              <v-btn block @click="newAnswer">
                <v-icon>add</v-icon>
                增加回答
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
      <!-- answer dialog -->
      <v-dialog v-model="new_answer.status" width="60%">
        <v-card>
          <v-card-text>
            <v-text-field v-model="new_answer.title" :rules="answer_rule.title" label="回答标题"></v-text-field>
            <v-text-field v-model="new_answer.content" :rules="answer_rule.content" label="内容"></v-text-field>
            <v-text-field v-model="new_answer.author" :rules="answer_rule.author" label="作者"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn flat color="blue" @click="createAnswer" :loading="new_answer.loading">保存</v-btn>
            <v-btn flat color="red" @click="new_answer.status = false">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import gql from "graphql-tag";
export default {
  props: {
    qadata: {
      required: true
    },
    editable: {
      type: Boolean,
      required: true
    },
    enable: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapState(["isMobile"])
  },
  data() {
    return {
      my_data: this.qadata,
      qa_schema: [
        { name: "牲口养殖", value: "ANIMAL_FARMING" },
        { name: "蔬果培育", value: "FRUIT_CULTIVATION" },
        { name: "农物栽种", value: "PLANTING" },
        { name: "其他", value: "OTHERS" }
      ],
      question_rule: {
        title: [v => !!v || "需要标题"],
        content: [v => !!v || "需要内容"]
      },
      answer_rule: {
        title: [v => !!v || "需要标题"],
        content: [v => !!v || "需要内容"],
        author: [v => !!v || "需要作者"]
      },
      new_answer: {
        isEdit: false,
        id: "",
        title: "",
        content: "",
        author: "",
        status: false,
        loading: false
      },
      answers: [],
      loading: false
    };
  },
  methods: {
    newAnswer() {
      this.new_answer.title = "";
      this.new_answer.content = "";
      this.new_answer.author = "";
      this.new_answer.id = "";
      this.new_answer.isEdit = false;
      this.new_answer.status = true;
      console.log(this.answers);
    },
    createAnswer() {
      if (this.new_answer.isEdit) {
        this.updateAnswer();
        return;
      }
      this.new_answer.loading = true;
      this.$apollo
        .mutate({
          mutation: gql`
            mutation CreateAnswer($data: AnswerCreateInput!) {
              createAnswer(data: $data) {
                id
              }
            }
          `,
          variables: {
            data: {
              title: this.new_answer.title,
              content: this.new_answer.content,
              author: this.new_answer.author,
              question: {
                connect: {
                  id: this.my_data.id
                }
              }
            }
          }
        })
        .then(data => {
          this.new_answer.status = false;
          this.$apollo.queries.answers.refetch();
        })
        .catch(err => {
          alert("创建回答失败");
          console.log(err);
          this.new_answer.loading = false;
        });
    },
    deleteAnswer(item) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation deleteAnswer($where: AnswerWhereUniqueInput!) {
              deleteAnswer(where: $where) {
                id
              }
            }
          `,
          variables: {
            where: {
              id: item.id
            }
          }
        })
        .then(data => {
          this.$apollo.queries.answers.refetch();
        })
        .catch(e => {
          console.log(e);
          alert("删除回答失败");
        });
    },
    editAnswer(item) {
      this.new_answer.title = item.title;
      this.new_answer.content = item.content;
      this.new_answer.author = item.author;
      this.new_answer.id = item.id;
      this.new_answer.isEdit = true;
      this.new_answer.status = true;
    },
    updateAnswer() {
      this.new_answer.loading = true;
      this.$apollo
        .mutate({
          mutation: gql`
            mutation updateAnswer(
              $where: AnswerWhereUniqueInput!
              $data: AnswerUpdateInput!
            ) {
              updateAnswer(where: $where, data: $data) {
                id
              }
            }
          `,
          variables: {
            where: {
              id: this.new_answer.id
            },
            data: {
              title: this.new_answer.title,
              content: this.new_answer.content,
              author: this.new_answer.author
            }
          }
        })
        .then(data => {
          this.$apollo.queries.answers.refetch();
          this.new_answer.loading = false;
          this.new_answer.status = false;
        })
        .catch(err => {
          console.log(err);
          alert("修改问题失败");
          this.new_answer.loading = false;
        });
    },
    updateQuestion() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation updateQuestion(
              $where: QuestionWhereUniqueInput!
              $data: QuestionUpdateInput!
            ) {
              updateQuestion(where: $where, data: $data) {
                id
              }
            }
          `,
          variables: {
            where: {
              id: this.my_data.id
            },
            data: {
              title: this.my_data.title,
              content: this.my_data.content,
              category: this.my_data.category
            }
          }
        })
        .then(data => {
          this.$emit("close");
        })
        .catch(err => {
          console.log(err);
          alert("修改问题失败");
        });
    }
  },
  apollo: {
    answers: {
      query: gql`
        query ListAnswer($where: QuestionWhereInput!) {
          questions(where: $where) {
            answers {
              id
              content
              title
              author
            }
          }
        }
      `,
      variables() {
        return {
          where: {
            id: this.my_data.id //question id
          }
        };
      },
      update(data) {
        return data.questions[0].answers;
      }
    }
  }
};
</script>

<style scoped>
.answer-card {
  border-radius: 10px;
}
.answer-author {
  color: grey;
  font-size: 12px;
  padding-left: 8px;
}
</style>

<style>
.v-toolbar__extension {
  height: auto !important;
  padding: 10px;
}
</style>


