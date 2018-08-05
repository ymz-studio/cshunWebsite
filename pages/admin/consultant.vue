<template>
  <div>
    <v-container>
      <!-- expert info -->
      <v-subheader>专家信息</v-subheader>
      <v-layout wrap>
        <v-flex xs12 sm6 md4 v-for="item in experts" :key="item.id" class="px-2 py-2">
          <v-card>
            <v-card-title>
              <h3>{{item.name}}</h3>
            </v-card-title>
            <v-card-text>
              {{item.introduction}}
            </v-card-text>
            <v-card-actions>
              <v-btn flat @click="editExpert(item)">编辑</v-btn>
              <v-btn flat color="red" @click="deleteExpert(item)">删除</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6 md4 class="px-2 py-2">
          <v-btn block @click="createExpert" class="ep-btn">
            <v-icon color="blue">add</v-icon>
            新增专家
          </v-btn>
        </v-flex>
      </v-layout>
      <EPDialog :epdata="expert_current" :enable="expert_current.status" :editable="true"
        v-if="expert_current.status" @close="expert_current.status=false;$apollo.queries.experts.refetch()"
      />
      <!-- qa system -->
      <v-subheader>问答系统</v-subheader>
      <v-card>
        <v-card-text>
          <v-data-table :items="questions" :headers="qa_headers" :rows-per-page-text="'每页显示行数'"
            :rows-per-page-items="qa_rows_per_page" :no-data-text="'暂时没有问题'" :loading="$apollo.queries.questions.loading">
            <template slot="items" slot-scope="props">
              <tr>
                <td>{{ props.item.title }}</td>
                <td>
                  {{ convert_category(props.item.category) }}
                </td>
                <td>
                  <v-chip color="green" outline v-if="props.item.status">已回答</v-chip>
                  <v-chip color="red" outline v-else>无回答</v-chip>
                </td>
                <td class="justify-center layout px-0" v-if="!isMobile">
                  <v-icon small class="mr-2" @click="editQA(props.item)">
                    edit
                  </v-icon>
                  <v-icon small @click="deleteQA(props.item)">
                    delete
                  </v-icon>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>
    <no-ssr>
      <QADialog :editable="true" :enable="qa_editing.status" :qadata="qa_editing.targetItem"
        @update="$apollo.queries.questions.refetch()" @close="qa_editing.status = false;$apollo.queries.questions.refetch()"
        v-if="qa_editing.status" />
    </no-ssr>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import gql from "graphql-tag";
import QADialog from "@/components/experts/qa-board";
import EPDialog from "@/components/experts/expert-board";

export default {
  components: { QADialog, EPDialog },
  computed: {
    ...mapState(["isMobile"])
  },
  data() {
    return {
      //问答信息
      qa_headers: [
        { text: "问题标题", value: "title" },
        { text: "分类", value: "category" },
        { text: "状态", value: "status", sortable: false }
      ],
      qa_schema: [
        { name: "牲口养殖", value: "ANIMAL_FARMING" },
        { name: "蔬果培育", value: "FRUIT_CULTIVATION" },
        { name: "农物栽种", value: "PLANTING" },
        { name: "其他", value: "OTHERS" }
      ],
      qa_rows_per_page: [20, 50, 100],
      qa_editing: {
        status: false,
        backUpItem: {},
        targetItem: {
          id: "",
          title: "",
          content: "",
          answers: []
        }
      },
      //专家信息
      experts: [],
      expert_current: {
        name: "",
        introduction: "",
        id: "",
        isCreate: true,
        status: false
      }
    };
  },
  methods: {
    //QA curd
    convert_category(item) {
      let result = this.qa_schema.find(({ value }) => {
        return value == item;
      });
      if (result) {
        return result.name;
      } else {
        return "暂未分类";
      }
    },
    deleteQA(item) {
      if (!confirm(`确认删除${item.title}这篇问答？`)) return;
      this.$apollo
        .mutate({
          mutation: gql`
            mutation DeleteQuestion($where: QuestionWhereUniqueInput!) {
              deleteQuestion(where: $where) {
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
          this.$apollo.queries.questions.refetch();
        })
        .catch(err => {
          alert("删除失败");
          consolel.log(err);
        });
    },
    editQA(item) {
      this.qa_editing.targetItem.title = item.title;
      this.qa_editing.targetItem.content = item.content;
      this.qa_editing.targetItem.id = item.id;
      this.qa_editing.targetItem.category = item.category;
      this.qa_editing.backUpItem = item;
      this.qa_editing.status = true;
    },
    //expert curd
    createExpert() {
      this.expert_current.name = "";
      this.expert_current.introduction = "";
      this.expert_current.isCreate = true;
      this.expert_current.status = true;
    },
    editExpert(item) {
      this.expert_current.name = item.name;
      this.expert_current.introduction = item.introduction;
      this.expert_current.id = item.id;
      this.expert_current.isCreate = false;
      this.expert_current.status = true;
    },
    deleteExpert(item) {
      if (!confirm(`确认删除 ${item.name} 专家信息？`)) return;
      this.$apollo.mutate({
        mutation: gql`
          mutation DeleteExpert($where: ExpertWhereUniqueInput!) {
            deleteExpert(where: $where){
              id
            }
          }
        `,
        variables: {
          where: {
            id: item.id
          }
        }
      }).then(data=>{
        this.$apollo.queries.experts.refetch();
      }).catch(err=>{
        console.log(err);
        alert('删除专家失败');
      })
    }
  },
  apollo: {
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
        return data.questions.map(question => {
          return {
            ...question,
            status: question.answers[0] ? true : false
          };
        });
      }
    },
    experts: {
      query: gql`
        {
          experts {
            id
            name
            introduction
          }
        }
      `
    }
  }
};
</script>

<style scoped>
.ep-btn {
  height: 100%;
  margin: 0px;
}
</style>
