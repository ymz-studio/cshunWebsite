<template>
  <v-dialog persistent v-model="enable" :fullscreen="isMobile" width="50%">
    <v-card tile>
      <!-- expert short introduce -->
      <v-toolbar extended>
        <v-btn icon @click="$emit('close')">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <v-toolbar-title v-if="!editable">{{my_data.name}}</v-toolbar-title>
        <v-toolbar-title v-else style="padding-top:20px;">
          <v-text-field v-model="my_data.name" :rules="rule.name" single-line></v-text-field>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- save metadata -->
        <v-btn icon v-if="editable" @click="updateExpert" :loading="loading">
          <v-icon color="blue">save</v-icon>
        </v-btn>
        <div slot="extension" :style="editable ? 'height:80px;width:100%':''">
          <p v-if="!editable">{{my_data.introduction}}</p>
          <v-form v-else>
            <v-text-field v-model="my_data.introduction" :rules="rule.introduction" label="简介"
              style="width:100%;"></v-text-field>
          </v-form>
        </div>
      </v-toolbar>
      <!-- expert profile -->
      <v-card v-if="editable">
        <v-subheader>专家简历</v-subheader>
        <v-progress-linear :indeterminate="true" v-show="$apollo.queries.profile.loading"
          color="warning" style="position:absolute;top:0;margin:0;"></v-progress-linear>
        <v-card-text>
          <VueEditor v-model="profile" style="max-height:800px;" v-if="!$apollo.queries.profile.loading"/>
          <span v-else>正在获取简历</span>
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click="updateExpert" :loading="loading">保存</v-btn>
          <v-btn flat @click="$emit('close')" color="red">取消</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-text v-html="profile"></v-card-text>
      </v-card>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import gql from "graphql-tag";
import VueEditor from "@/components/vue-editor";

export default {
  computed: {
    ...mapState(["isMobile"])
  },
  components: {
    VueEditor
  },
  props: {
    epdata: {
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
  data() {
    return {
      my_data: this.epdata,
      profile: "",
      rule: {
        name: [v => !!v || "需要姓名"],
        introduction: [v => !!v || "需要简介"]
      },
      loading: false
    };
  },
  methods: {
    updateExpert() {
      if (this.my_data.isCreate) {
        this.createExpert();
        return;
      }
      this.loading = true;
      this.$apollo.mutate({
        mutation: gql`
            mutation CreateExpert($data: ExpertUpdateInput!, $where: ExpertWhereUniqueInput!) {
              updateExpert(data:$data, where:$where){
                id
              }
            }
          `,
          variables: {
            data: {
              name: this.my_data.name,
              introduction: this.my_data.introduction,
              profile: this.profile
            },
            where:{
              id:this.my_data.id
            }
          }
        })
        .then(data => {
          this.$emit("close");
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          alert("保存信息失败");
      })
    },
    createExpert() {
      this.loading = true;
      this.$apollo
        .mutate({
          mutation: gql`
            mutation CreateExpert($data: ExpertCreateInput!) {
              createExpert(data: $data) {
                id
              }
            }
          `,
          variables: {
            data: {
              name: this.my_data.name,
              introduction: this.my_data.introduction,
              profile: this.profile
            }
          }
        })
        .then(data => {
          this.$emit("close");
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          alert("保存信息失败");
        });
    }
  },
  apollo: {
    profile: {
      query: gql`
        query ListExperts($where: ExpertWhereInput!) {
          experts(where: $where) {
            profile
          }
        }
      `,
      variables() {
        return {
          where: {
            id: this.my_data.id //expert id
          }
        };
      },
      update(data) {
        return data.experts[0].profile;
      },
      skip() {
        return this.my_data.isCreate; //新建不做查询
      }
    }
  }
};
</script>

<style>
.ql-container {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
