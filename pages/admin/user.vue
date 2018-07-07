<template>
    <v-container>
        <v-subheader>全部用户</v-subheader>
        <v-card>
            <v-data-table :loading="loading>0" :headers="isMobile? mobileHeaders : headers" :items="users" hide-actions>
                <template slot="items" slot-scope="props">
                    <tr @click="name=props.item.name;role=props.item.role;isCreate = false;dialog = true;editID = props.item.id" class="item">
                        <td>{{ props.item.name }}</td>
                        <td class="role-list">
                            <v-layout wrap style="padding-top:0.5em">
                                <span v-for="(item,i) in props.item.role" :key="i">{{$roleMap[item]}}</span>
                            </v-layout>
                        </td>
                        <td v-if="!isMobile">{{props.item.lastLoginAt? $fromNow(props.item.lastLoginAt) :'从未登录' }}</td>
                        <td v-if="!isMobile">{{ $yearDateTime(props.item.createdAt) }}</td>
                    </tr>
                </template>
                <template slot="no-data">
                    暂时没有用户数据
                </template>
            </v-data-table>
        </v-card>
        <v-layout justify-end class="mt-2">
            <v-btn open-on-hover color="primary" :block="isMobile" @click="isCreate = true; dialog = true">新增</v-btn>
        </v-layout>
        <my-dialog v-model="dialog" :title="isCreate ? '新增用户':'更新用户信息' " @submit="submit" :loading="loading>0">
            <v-form ref="form">
                <v-text-field v-model="name" :rules="nameRule" label="请输入用户名"></v-text-field>
                <v-text-field v-if="isCreate" type="password" v-model="password" :rules="passwordRule" label="请输入密码"></v-text-field>
                <v-layout v-else align-center>
                    <v-checkbox @change="$refs['form'].validate()" v-model="resetPassword" hide-details class="shrink mr-2"></v-checkbox>
                    <v-text-field :disabled="!resetPassword" type="password" v-model="password" :rules="passwordRule" label="重置密码"></v-text-field>
                </v-layout>
                <v-layout :wrap="true" class="mt-3" column>
                    <v-flex wrap>
                        <v-checkbox v-model="role" :rules="roleRule" label="超级管理员" value="ADMIN"></v-checkbox>
                    </v-flex>
                    <v-flex wrap>
                        <v-checkbox v-for="item in 4" :key="item" hide-details :rules="roleRule" v-model="role" :label="$roleMap[`SUB_ADMIN_${item}`]" :value="`SUB_ADMIN_${item}`"></v-checkbox>
                    </v-flex>
                </v-layout>
            </v-form>
            <v-divider/>
            <v-btn v-if="!isCreate" class="my-3" color="error" @click="del">删除此用户</v-btn>
        </my-dialog>
    </v-container>
</template>

<script>
import gql from 'graphql-tag'
import { mapState, mapMutations } from 'vuex';
import MyDialog from '@/components/dialog'
export default {
    components: { MyDialog },
    data() {
        return {
            users: [],
            headers: [
                { text: '用户名', value: 'name' },
                { text: "可管理模块", value: 'role' },
                { text: '上次登录', value: 'lastLoginAt' },
                { text: '注册时间', value: 'createdAt' }
            ],
            mobileHeaders: [
                { text: '用户名', value: 'name' },
                { text: "可管理模块", value: 'role' },
            ],
            name: "",
            nameRule: [
                v => v.length >= 3 && v.length <= 16 || "用户名应为3-16位字符"
            ],
            password: "",
            passwordRule: [
                v => (/[a-zA-Z0-9_]{3,16}/.test(v) || (!this.isCreate && !this.resetPassword)) || "密码应为5-12位字符"
            ],
            role: [],
            roleRule: [
                v => this.role && this.role.length > 0 || "用户权限不能为空",
                v => (this.role && this.role.includes('ADMIN') && this.role.length === 1) || this.role && !this.role.includes('ADMIN') || "超级管理不能与其他权限并存"
            ],
            resetPassword: false,
            editID: "",
            isCreate: false,
            dialog: false,
            loading: 0
        }
    },
    methods: {
        ...mapMutations(['snackBarOpen']),
        async submit() {
            if (this.$refs['form'].validate()) {
                // 拼装权限字符串
                let roleStr = '['
                this.role.forEach(item => {
                    roleStr += (item + ',')
                })
                roleStr += ']'
                let mutation;
                if (this.isCreate) {
                    mutation = gql`mutation{
                        subAdminSignUp(data:{
                            name:"${this.name}"
                            password:"${this.password}"
                            role:{
                            set:${roleStr}
                            }
                        }){
                            token
                        }
                        }`
                } else if (this.resetPassword) {
                    mutation =
                        gql`mutation{subAdminUpdate(id: "${this.editID}", data: { name: "${this.name}", role: { set: ${roleStr}},password:"${this.password}"  }){id}}`
                } else {
                    mutation = gql`mutation{subAdminUpdate(id: "${this.editID}", data: { name: "${this.name}", role: { set: ${roleStr}} }){id}}`
                }

                this.loading += 1
                try {
                    await this.$apollo.mutate({ mutation })
                    this.snackBarOpen({
                        title: "操作成功",
                        text: `用户:${this.name} 操作成功`
                    })
                    this.dialog = false
                    this.$apollo.queries.users.refetch()
                } catch (e) {
                    this.snackBarOpen({
                        title: "操作失败",
                        text: e.toString()
                    })
                } finally {
                    this.loading -= 1
                }
            }


        },
        async del() {
            if (confirm('此操作不可恢复,是否继续进行?')) {
                this.loading += 1
                const mutation = gql`
                mutation {
                      subAdminDelete(id: "${this.editID}") {
                        id
                      }
                    }
                `
                try {
                    await this.$apollo.mutate({ mutation })
                    this.dialog = false
                    this.$apollo.queries.users.refetch()
                    this.snackBarOpen({
                        title: "操作成功",
                        text: `用户:${this.name} 操作成功`
                    })
                } catch (e) {
                    this.snackBarOpen({
                        title: "操作失败",
                        text: e.toString()
                    })
                } finally {
                    this.loading -= 1
                }
            }
        }
    },
    apollo: {
        users: {
            query: gql`{
                 users {
                   id
                   role
                   name
                   lastLoginAt
                   createdAt
                 }
            }`,
            loadingKey: 'loading'
        }
    },
    computed: {
        ...mapState(['isMobile']),
    },
    watch: {
        // 关闭对话框重置表单
        dialog(newValue, oldValue) {
            if (!newValue && oldValue) {
                this.$refs['form'].reset()
                this.role = []
                this.name = ""
                this.password = ""

            }
        },
        role(newValue, oldValue) {
            if (newValue != oldValue) {
                this.$refs['form'].validate()
            }
        }
    },
}

</script>
<style lang="stylus" scoped>
.role-list {
    span {
        padding: 0.5em;
        border: 1px solid #000;
        margin-right: 0.5em;
        margin-bottom: 0.5em;
    }

    span:last-child {
        margin-right: 0;
    }
}

.item {
    cursor: pointer;
}
</style>
