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
              <v-btn flat>新建文章</v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-flex>
        <v-flex xs12>
          <v-card>
            <v-card-text>
              <v-data-table :items="posts" :headers="headers" style="width:100%;">
                <template slot="items" slot-scope="props">
                  <td class="text-xs-center">{{ props.item.title }}</td>
                  <td class="text-xs-center">{{ props.item.category }}</td>
                  <td class="text-xs-center">{{ props.item.author }}</td>
                  <td class="justify-center layout px-0" v-if="!isMobile">
                    <v-icon small class="mr-2" @click="editArticle(props.item)">
                      edit
                    </v-icon>
                    <v-icon small @click="deleteArticle(props.item)">
                      delete
                    </v-icon>
                  </td>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-navigation-drawer :value="editing.status" stateless :hide-overlay="false" right fixed temporary :width="700">
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
          <v-form>
            <v-text-field v-model="editing.targetItem.title" label="标题"></v-text-field>
            <v-text-field v-model="editing.targetItem.author" label="作者"></v-text-field>
          </v-form>
        </v-flex>
        <v-flex xs12>
          <!-- content -->
          <VueEditor v-model="editing.targetItem.content" />
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
      editing: {
        status: false,
        method: "edit",
        targetItem: {
          title: "",
          content: "",
          author: "",
          category: ""
        }
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
      ]
    };
  },
  methods: {
    editArticle(item) {
      this.editing.targetItem.title = item.title;
      this.editing.targetItem.author = item.author;
      this.editing.targetItem.category = item.category;
      this.editing.targetItem.content = item.content;
      this.editing.status = true;
    }
  },
  apollo: {
    posts: {
      query: gql`
        {
          posts {
            title
            content
            category
            author
          }
        }
      `
    }
  },
  computed: {
    ...mapState(["isMobile"])
  }
};
</script>

<style scoped>
</style>
