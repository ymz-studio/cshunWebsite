<template>
  <div>
    <v-container>
      <v-layout wrap column>
        <v-flex xs12>
          <v-toolbar color="white" dense prominent>
            <v-toolbar-title>文章列表</v-toolbar-title>
            <v-divider class="mx-2" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-toolbar-items v-if="!isMobile">
              <v-btn flat @click="createArticle">新建文章</v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-flex>
        <v-flex xs12>
          <v-card>
            <v-card-text>
              <v-data-table :items="posts" :headers="headers" style="width:100%;" :rows-per-page-text="'每页显示行数'"
                :rows-per-page-items="rows_per_page" :no-data-text="'暂时没有文章'" :pagination.sync="pagination"
                :loading="$apollo.queries.posts.loading">
                <template slot="items" slot-scope="props">
                  <tr @click="readArticle(props.item)">
                    <td class="text-xs-center">{{ props.item.title }}</td>
                    <td class="text-xs-center">
                      {{ convert_category(props.item.category) }}
                    </td>
                    <td class="text-xs-center">{{ props.item.author }}</td>
                    <td class="justify-center layout px-0" v-if="!isMobile">
                      <v-icon small class="mr-2" @click="editArticle(props.item)">
                        edit
                      </v-icon>
                      <v-icon small @click="deleteArticle(props.item)">
                        delete
                      </v-icon>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- PC端编辑文章抽屉 -->
    <v-navigation-drawer :value="editing.status" stateless :hide-overlay="false" right
      fixed temporary :width="700" v-if="!isMobile">
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              编辑文章
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-layout wrap class="px-3 py-3">
        <v-flex xs12>
          <!-- meta data -->
          <v-form v-model="post_rule.valid">
            <v-text-field v-model="editing.targetItem.title" :rules="post_rule.title" label="标题"></v-text-field>
            <v-text-field v-model="editing.targetItem.author" :rules="post_rule.author" label="作者"></v-text-field>
            <v-select :items="category_schema" label="分类" item-text="name" item-value="value" v-model="editing.targetItem.category"></v-select>
          </v-form>
        </v-flex>
        <v-flex xs12>
          <!-- content -->
          <VueEditor v-model="editing.targetItem.content" />
        </v-flex>
        <v-flex xs4 offset-xs8>
          <v-btn flat color="blue" @click="saveEdit" :loading="save_progress" :disabled="!post_rule.valid">保存</v-btn>
          <v-btn flat color="error" @click="cancelEdit">取消</v-btn>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>
    <!-- 手机端阅读文章抽屉 -->
    <v-navigation-drawer :value="reading.status" stateless :hide-overlay="false" right
      fixed temporary :width="700" v-if="isMobile">
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              阅读文章
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-layout wrap class="px-3 py-3">
        <v-flex xs12>
          <!-- meta data -->
          <h2 class="text-xs-center">{{reading.title}}</h2>
          <h3 class="text-xs-center">作者：{{reading.author}}</h3>
        </v-flex>
        <div v-html="reading.content"></div>
        <v-flex xs4 offset-xs8>
          <v-btn color="primary" @click="reading.status = false">返回</v-btn>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from "vuex";
import VueEditor from "@/components/vue-editor";
import gql from "graphql-tag";
export default {
  components: {
    VueEditor
  },
  data() {
    return {
      category_schema: [
        { name: "政策文章", value: "POLICY" },
        { name: "热点新闻", value: "NEWS" },
        { name: "工作计划", value: "TREND" }
      ],
      editing: {
        status: false,
        method: "edit",
        targetItem: {
          title: "",
          content: "",
          author: "",
          category: ""
        },
        backUpItem: {}
      },
      reading: {
        status: false
      },
      headers: [
        {
          text: "文章标题",
          align: "center",
          sortable: false,
          value: "title"
        },
        {
          text: "分类",
          align: "center",
          sortable: false,
          value: "category"
        },
        {
          text: "作者",
          align: "center",
          sortable: false,
          value: "author"
        }
      ],
      posts: [
        {
          id: "",
          title: "",
          author: "",
          content: "",
          updatedAt: ""
        }
      ],
      post_rule: {
        title: [v => !!v || "需要标题"],
        author: [v => !!v || "需要作者"],
        valid: false
      },
      save_progress: false,
      pagination: {},
      rows_per_page: [5, 10, 25]
    };
  },
  methods: {
    createArticle() {
      this.editing.targetItem.title = "";
      this.editing.targetItem.author = "";
      this.editing.targetItem.category = "";
      this.editing.targetItem.content = "";
      this.editing.backUpItem = null;
      this.editing.status = true;
    },
    editArticle(item) {
      this.editing.targetItem.title = item.title;
      this.editing.targetItem.author = item.author;
      this.editing.targetItem.category = item.category;
      this.editing.targetItem.content = item.content;
      this.editing.backUpItem = item;
      this.editing.status = true;
    },
    deleteArticle(item) {
      if (!confirm(`确认删除《${item.title}》这篇文章？`)) {
        return;
      }
      this.$apollo
        .mutate({
          mutation: gql`
            mutation DeletePost($where: PostWhereUniqueInput!) {
              deletePost(where: $where) {
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
          console.log(data);
          this.fetchData();
        })
        .catch(err => {
          alert("删除失败");
        });
    },
    readArticle(item) {
      if (this.isMobile) {
        this.reading.title = item.title;
        this.reading.author = item.author;
        this.reading.content = item.content;
        this.reading.status = true;
      }
    },
    saveEdit() {
      if (!this.editing.backUpItem) {
        //create post
        this.save_progress = true;
        this.$apollo
          .mutate({
            mutation: gql`
              mutation CreatePost($newPost: PostCreateInput!) {
                createPost(data: $newPost) {
                  id
                }
              }
            `,
            variables: {
              newPost: {
                title: this.editing.targetItem.title,
                category: this.editing.targetItem.title,
                author: this.editing.targetItem.author,
                content: this.editing.targetItem.content
              }
            }
          })
          .then(data => {
            console.log(data);
            this.fetchData();
            this.save_progress = false;
            this.editing.status = false;
          })
          .catch(err => {
            console.log(err);
            this.save_progress = false;
          });
      } else {
        //update post
        this.save_progress = true;
        this.$apollo
          .mutate({
            mutation: gql`
              mutation UpdatePost(
                $data: PostUpdateInput!
                $where: PostWhereUniqueInput!
              ) {
                updatePost(data: $data, where: $where) {
                  id
                }
              }
            `,
            variables: {
              data: {
                title: this.editing.targetItem.title,
                category: this.editing.targetItem.category,
                author: this.editing.targetItem.author,
                content: this.editing.targetItem.content
              },
              where: {
                id: this.editing.backUpItem.id
              }
            }
          })
          .then(data => {
            this.fetchData();
            this.save_progress = false;
            this.editing.status = false;
            console.log(data);
          })
          .catch(err => {
            this.save_progress = false;
            console.log(err);
            alert("保存出错！");
          });
      }
    },
    cancelEdit() {
      if (confirm("将丢弃所有更改，确实取消？")) {
        this.editing.status = false;
      }
    },
    fetchData() {
      this.$apollo.queries.posts.refetch({
        first: this.pagination.rowsPerPage,
        skip: (this.pagination.page - 1) * this.pagination.rowsPerPage
      });
    },
    convert_category(item) {
      let result = this.category_schema.find(({ value }) => {
        return value == item;
      });
      return result.name;
    }
  },
  watch: {
    pagination() {
      console.log(this.pagination);
      this.fetchData();
    }
  },
  apollo: {
    posts: {
      query: gql`
        query ListPosts($first: Int!, $skip: Int!) {
          posts(first: $first, skip: $skip) {
            id
            title
            content
            category
            author
          }
        }
      `,
      //reactive params
      variables() {
        return {
          first: 5,
          skip: 0
        };
      }
    }
  },
  computed: {
    ...mapState(["isMobile"])
  }
};
</script>

<style scoped>
</style>

