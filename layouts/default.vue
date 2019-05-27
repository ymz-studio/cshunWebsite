<template>
  <v-app>
    <v-toolbar app class="nav">
      <v-toolbar-side-icon v-show="isMobile" @click="sideVisible = !sideVisible"></v-toolbar-side-icon>
      <v-toolbar-title class="logo">
        <v-layout align-center>
          <img src="~assets/logo-120x120.png" class="mr-2">
          <span>长顺扶贫信息在线平台</span>
        </v-layout>
      </v-toolbar-title>
      <v-spacer />
      <v-layout v-show="!isMobile" justify-end class="btn-nav">
        <v-btn v-for="item in route" :key="item.title" exact flat nuxt class="btn-nav"
          :to="item.path" :disabled="path === item.path">
          {{item.title}}
        </v-btn>
        <v-btn exact flat nuxt class="btn-nav">
          <a href="http://39.98.84.18:3000">产销对接平台</a>
        </v-btn>
        <v-btn exact flat nuxt class="btn-nav">
          <a href="http://39.98.84.18">可视化数据库</a>
        </v-btn>
      </v-layout>
    </v-toolbar>
    <v-navigation-drawer fixed v-show="isMobile" v-model="sideVisible">
      <v-layout column class="btn-nav">
        <v-btn v-for="item in route" :key="item.title" exact flat nuxt :to="item.path"
          :disabled="path === item.path">
          {{item.title}}
        </v-btn>
      </v-layout>
    </v-navigation-drawer>
    <v-content>
      <nuxt></nuxt>
    </v-content>
    <v-footer class="footer pa-3" dark height="50">
      <v-layout justify-center align-center>
        &copy; 2019 北京邮电大学 计算机学院
        <v-btn flat class="footer-btn">联系我们</v-btn>
      </v-layout>
    </v-footer>
  </v-app>
</template>
<style lang="stylus" scoped>
.logo {
  img {
    width: 2em;
    height: 2em;
  }
}

.nav {
  z-index: 100;
}

.btn-nav {
  height: 100%;
  margin: 0;
}

.nav-active {
  color: red;
}

.footer {
  color: #efefef;
}

.footer-btn {
  margin: 0;
  padding: 0;
  color: #bcbcbc;
}
</style>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      route: [
        { path: "/", title: "首页" },
        { path: "/about", title: "关于长顺" },
        { path: "/consultant", title: "专家咨询" },
        { path: "/policy", title: "扶贫政策" }
      ]
    };
  },
  computed: {
    ...mapState(["isMobile", "sideBarOpened"]),
    sideVisible: {
      get() {
        return this.sideBarOpened;
      },
      set(newValue) {
        this.setSideBar(newValue);
      }
    },
    path() {
      return this.$route.path;
    }
  },
  methods: {
    ...mapMutations(["setDevice", "setSideBar"]),
    onResize() {
      this.setDevice(window.innerWidth < 820);
    }
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize, { passive: true });
  },
  beforeDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.onResize, { passive: true });
    }
  }
};
</script>
