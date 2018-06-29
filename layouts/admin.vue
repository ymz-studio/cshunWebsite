<template>
    <v-app>
        <v-toolbar app dark v-if="user" clipped-left>
            <v-toolbar-side-icon v-if="isMobile" @click="sideVisible = !sideVisible"></v-toolbar-side-icon>
            <v-toolbar-title>助顺邮我-网站管理</v-toolbar-title>
        </v-toolbar>
        <v-navigation-drawer app fixed :permanent="!isMobile" :clipped="!isMobile" v-model="sideVisible" v-if="user">
            <v-subheader>用户信息</v-subheader>
            <v-container>
                <h1>{{user.name}}</h1>
                <v-layout class="mb-1" wrap>
                    <span v-for="(item,i) in user.role" :key="i" class="tag">
                        {{item}}
                    </span>
                </v-layout>
                <v-layout column class="mb-3">
                    <span class="mb-2">注册时间:
                        <strong>{{$dateTime(user.createdAt)}}</strong>
                    </span>
                    <span>最后一次登录:
                        <strong>{{$fromNow(user.lastLoginAt)}}</strong>
                    </span>
                </v-layout>
                <v-btn color="primary" block @click="sideVisible = false;$apolloHelpers.onLogout()">登出</v-btn>
            </v-container>
            <v-divider dark></v-divider>
            <v-subheader>控制面板</v-subheader>
            <v-btn large v-for="(item,i) in availableRoutes" :key="i" nuxt :to="item.url" exact block flat>
                <v-layout align-center>
                    <v-icon>{{item.icon}}</v-icon>
                    <span class="pl-2">{{item.title}}</span>
                </v-layout>
            </v-btn>
        </v-navigation-drawer>
        <v-content>
            <nuxt></nuxt>
        </v-content>
        <v-footer app inset>
            <v-layout align-center justify-center>
                <span style="color:#bcbcbc">2018 &copy; 北京邮电大学 计算机学院</span>
            </v-layout>
        </v-footer>
    </v-app>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
    head() {
        return {
            title: "助顺邮我-网站管理",
        }
    },
    data() {
        return {
            routes: [
                { title: "用户管理", url: "/admin/user", role: ['ADMIN'], icon: 'people' },
                { title: "政策文章", url: "/admin/article", role: ['ADMIN', 'SUB_ADMIN_1'], icon: 'insert_drive_file' },
                { title: "专家解答", url: "/admin/consultant", role: ['ADMIN', 'SUB_ADMIN_2'], icon: 'chat' },
                { title: "旅游资源", url: "/admin/source", role: ['ADMIN', 'SUB_ADMIN_3'], icon: 'location_on' },
                { title: "产销对接", url: "admin/sell", role: ['ADMIN', 'SUB_ADMIN_4'], icon: 'receipt' }
            ]
        }
    },
    computed: {
        ...mapState(['isMobile', 'sideBarOpened', 'user']),
        sideVisible: {
            get() {
                return this.sideBarOpened
            },
            set(newValue) {
                this.setSideBar(newValue)
            }
        },
        path() {
            return this.$route.path
        },
        // 符合当前角色的合法路由
        availableRoutes() {
            return this.user ? this.routes.filter(item => this.$hasRole(this.user.role, item.role)) : []
        }
    },
    methods: {
        ...mapMutations(['setDevice', 'setSideBar']),
        onResize() {
            this.setDevice(window.innerWidth < 820)
        },

    },
    watch: {
        // 自动跳转到第一条可用路由
        availableRoutes(newValue, oldValue) {
            if (newValue !== oldValue && newValue.length) {
                this.$router.push(this.availableRoutes[0].url)
            }
        }
    },
    mounted() {
        this.onResize();
        window.addEventListener('resize', this.onResize, { passive: true })
    },
    beforeDestroy() {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', this.onResize, { passive: true })
        }
    },

}
</script>

<style scoped>
.tag{
    padding: 0.5em;
    margin-bottom: 0.5em;
    border: 1px solid #555;
    margin-right: 0.5em;
}
.tag:last-child{
    margin-right: 0;
}
</style>