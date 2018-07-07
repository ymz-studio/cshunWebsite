<template>
    <div>
        <v-dialog fullscreen :value="!me && loading" transition="fade-transition">
            <v-card>
                <v-layout style="height:100vh" justify-center align-center>
                    <v-progress-circular :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
                </v-layout>
            </v-card>
        </v-dialog>
        <v-dialog :fullscreen="isMobile" :value="!me && !loading" persistent title="管理员登录" width="70%">
            <v-card tile>
                <v-container>
                    <v-card-title>
                        <v-subheader>管理员登录</v-subheader>
                    </v-card-title>
                    <v-card-text>
                        <v-form ref="form">
                            <v-text-field v-model="username" :rules="usernameRule" label="用户名" counter="16"></v-text-field>
                            <v-text-field v-model="password" :rules="passwordRule" label="密码" type="password" counter="12"></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-layout align-center wrap>
                            <v-flex xs12 sm8>
                                <span style="color:#bcbcbc">如忘记密码请联系超级管理员重置</span>
                            </v-flex>
                            <v-flex xs12 sm4 class="mt-2">
                                <v-layout justify-end>
                                    <v-btn :block="isMobile" color="primary" @click="submit" :loading="loading>0">提交</v-btn>
                                </v-layout>
                            </v-flex>
                        </v-layout>

                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
        <nuxt-child></nuxt-child>
        <v-snackbar v-model="snackBarOpened" :title="snackBar.title" right bottom>{{snackBar.text}}</v-snackbar>
    </div>
</template>

<script>
import gql from "graphql-tag";
import { mapMutations, mapState } from 'vuex';
export default {
    data() {
        return {
            me: null,
            loading: 0,
            username: "",
            usernameRule: [
                v => v.length >= 3 && v.length <= 16 || "用户名应为3-16位字符"
            ],
            password: "",
            passwordRule: [
                v => /[a-zA-Z0-9_]{3,16}/.test(v) || "密码应为5-12位字符"
            ],
        }
    },
    layout: 'admin',
    computed: {
        ...mapState(['isMobile', 'snackBar']),
        token() {
            return this.$apolloHelpers.getToken()
        },
        snackBarOpened: {
            get() {
                return this.snackBar.opened
            },
            set(newValue) {
                if (!newValue) {
                    this.snackBarClose()
                }
            }
        }
    },
    apollo: {
        me: {
            query: gql`
            {
                me{
                    id
                    name
                    role
                    createdAt
                    lastLoginAt
                }
            }`,
            error(e) {
                console.log(e);
            },
            loadingKey: 'loading'
        }
    },
    methods: {
        ...mapMutations(['setUser', 'snackBarOpen', 'snackBarClose']),
        async submit() {
            if (this.$refs['form'].validate()) {
                const mutation = gql`
                    mutation{
                           login(name:"${this.username}",password:"${this.password}"){
                               token
                           }
                       }
                 `
                try {
                    let { data: { login: { token } } } = await this.$apollo.mutate({
                        mutation
                    })
                    this.$apolloHelpers.onLogin(token)
                } catch (e) {
                    this.snackBarOpen({
                        title: "登录失败",
                        text: e.message
                    })

                }

            }

        }
    },
    watch: {
        me(newValue, oldValue) {
            if (newValue) {
                this.setUser(newValue)
            }
        }
    },
}
</script>

<style scoped>

</style>