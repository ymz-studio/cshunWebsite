<template>
  <div>
    <hero :src="require('assets/consultant/hero.jpg')" title="专家咨询" subTitle="信息广泛，全方面助力您的生产"></hero>
    <!-- experts -->
    <v-container fluid class="bg-grey has-border">
      <v-container>
        <h2 class="text-xs-center">著名专家</h2>
        <v-layout wrap>
          <template v-for="n in 8">
            <v-flex :key="n" xs6 md3 class="px-2 py-2">
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
          <v-flex xs12 sm6 v-for="n in 4" :key="n" class="px-2 py-2">
            <v-list two-line>
              <v-subheader>
                问题分类{{n}}:
              </v-subheader>
              <template v-for="n in 3">
                <v-list-tile :key="n" @click="">
                  <v-list-tile-content>
                    <v-list-tile-title v-html="'问题标题'"></v-list-tile-title>
                    <v-list-tile-sub-title>
                      <span style="color:#333">TO:alex, nick --</span>
                      <span>Erifo can junno fraci tracco? Wnior sraiaf carrigo!</span>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-divider :key="n + 10"></v-divider>
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
              <v-text-field v-model="question.title" :rules="question_rule.title" label="问题标题" required></v-text-field>
              <v-text-field v-model="question.content" :rules="question_rule.content" label="问题内容" required></v-text-field>
              <v-btn :disabled="!question.valid" color="primary">提交问题</v-btn>
              <v-btn flat color="primary" @click="question.title = question.content = ''">清除内容</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
    <!-- atricle -->
    <v-container fluid class="bg-white">
      <v-container>
        <h2 class="text-xs-center">相关文章</h2>
        <v-layout column>
          <v-flex v-for="t in 3" :key="t" class="py-4">
            <v-subheader>
              文章分类{{t}}:
            </v-subheader>
            <v-data-table :headers="headers" :items="posts" hide-actions class="elevation-1">
              <template slot="items" slot-scope="props">
                <td>{{ props.item.title }}</td>
                <td class="text-xs-right">{{ props.item.date }}</td>
              </template>
            </v-data-table>
          </v-flex>
        </v-layout>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Hero from "@/components/hero";
import FileUpload from "@/components/file-upload";
export default {
  components: {
    Hero,
    FileUpload
  },
  computed: {
    ...mapState(["isMobile"])
  },
  data() {
    return {
      question: {
        valid: false,
        title: "",
        content: ""
      },
      question_rule: {
        title: [v => !!v || "Title is required"],
        content: [v => !!v || "Content is required"]
      },
      headers: [
        { text: "标题", value: "title" },
        { text: "日期", value: "date", align:'right' }
      ],
      posts:[
        {title:"编译原理", date:"2018-07-05"},
        {title:"CSAPP", date:"2018-07-16"},
        {title:"编译器设计", date:"2018-12-16"},
        {title:"编译原理", date:"2018-07-05"},
        {title:"CSAPP", date:"2018-07-16"},
        {title:"编译器设计", date:"2018-12-16"},
        {title:"编译原理", date:"2018-07-05"},
        {title:"CSAPP", date:"2018-07-16"},
        {title:"编译器设计", date:"2018-12-16"},
      ]
    };
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
</style>
