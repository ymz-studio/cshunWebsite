<template>
    <v-container>
        <v-subheader>全部美食</v-subheader>
        <v-card>
            <v-data-table :headers="isMobile ? mobileHeaders.food : headers.food" :loading="loading>0" :items="foods" hide-actions>
                <template slot="items" slot-scope="props">
                    <tr @click="setForm(props.item); isCreate = false;dialog = true;editID=props.item.id" style="cursor:pointer">
                        <td>{{ props.item.name }}</td>
                    </tr>
                </template>
                <template slot="no-data">
                    <v-layout justify-center>
                        <span>暂时没有美食数据</span>
                    </v-layout>
                </template>
            </v-data-table>
        </v-card>
        <v-layout justify-end class="mt-2">
            <v-btn open-on-hover color="primary" :block="isMobile" @click="reset();isCreate = true; dialog = true">新增</v-btn>
        </v-layout>
        <v-subheader>全部酒店</v-subheader>
        <v-card>
            <v-data-table :headers="isMobile ? mobileHeaders.hotel : headers.hotel" :loading="loading>0" :items="hotels" hide-actions>
                <template slot="items" slot-scope="props">
                    <tr @click="setForm(props.item); isCreate = false;dialog = true;editID=props.item.id" style="cursor:pointer">
                        <td>{{ props.item.name }}</td>
                        <td v-if="!isMobile">{{ props.item.score }}</td>
                        <td  v-if="!isMobile">{{ props.item.address }}</td>
                    </tr>
                </template>
                <template slot="no-data">
                    <v-layout justify-center>
                        <span>暂时没有酒店数据</span>
                    </v-layout>
                </template>
            </v-data-table>
        </v-card>
        <v-layout justify-end class="mt-2">
            <v-btn open-on-hover color="primary" :block="isMobile" @click="reset();isCreate = true; dialog = true">新增</v-btn>
        </v-layout>











        <my-dialog :title="isCreate ? '添加美食' : '更新美食信息'" v-model="dialog.food" @submit="submit" :loading="this.loading>0">
            <v-form ref="form">
                <v-text-field v-model="name" :rules="nameRules" :counter="15" label="美食名"></v-text-field>
                <v-layout column>
                    <v-subheader class="pl-0">{{isCreate ? '点击上传美食图片' : '点击更新美食图片'}}</v-subheader>
                    <file-upload v-model="file" accept="image/*">
                        <v-icon>cloud_upload</v-icon>
                    </file-upload>
                    <v-subheader class="pl-0">请上传宽高比为
                        <strong>16:9</strong>, 大小不超过
                        <strong>2m</strong>的图片</v-subheader>
                    <v-subheader class="pl-0" v-if="file">图片预览</v-subheader>
                    <v-layout v-if="file">
                        <v-flex xs12 sm10 md8 lg6>
                            <resize-box style="border:1px solid #bcbcbc">
                                <img :src="file.url" style="height:100%;width:100%">
                            </resize-box>
                        </v-flex>
                    </v-layout>
                </v-layout>
            </v-form>
            <v-btn v-if="!isCreate" class="my-3" color="error" @click="del">删除美食</v-btn>
        </my-dialog>

        <my-dialog :title="isCreate ? '添加酒店' : '更新酒店信息'" v-model="dialog.hotel" @submit="submit" :loading="this.loading>0">
            <v-form ref="form">
                <v-text-field v-model="name" :rules="nameRules" :counter="15" label="店铺名"></v-text-field>
                <v-text-field v-model="url" :rules="urlRules" label="店铺链接"></v-text-field>
                <v-layout column>
                    <v-subheader class="pl-0">{{isCreate ? '点击上传店铺图片' : '点击更新店铺图片'}}</v-subheader>
                    <file-upload v-model="file" accept="image/*">
                        <v-icon>cloud_upload</v-icon>
                    </file-upload>
                    <v-subheader class="pl-0">请上传宽高比为
                        <strong>16:9</strong>, 大小不超过
                        <strong>2m</strong>的图片</v-subheader>
                    <v-subheader class="pl-0" v-if="file">图片预览</v-subheader>
                    <v-layout v-if="file">
                        <v-flex xs12 sm10 md8 lg6>
                            <resize-box style="border:1px solid #bcbcbc">
                                <img :src="file.url" style="height:100%;width:100%">
                            </resize-box>
                        </v-flex>
                    </v-layout>
                </v-layout>
            </v-form>
            <v-btn v-if="!isCreate" class="my-3" color="error" @click="del">删除此店铺</v-btn>
        </my-dialog>
    </v-container>
</template>

<script>
import gql from "graphql-tag";
import MyDialog from "@/components/dialog";
import FileUpload from "@/components/file-upload";
import resizeBox from "@/components/resizeBox.vue";
import { mapState, mapMutations } from "vuex";
export default {
	data() {
		return {
			hotels: [],
			foods: [],
			loading: 0,
			isCreate: {
				hotel: false,
				food: false
			},
			dialog: {
				hotel: false,
				food: false
			},
			headers: {
				hotel: [
					{ text: "酒店名称", value: "name" },
                    { text: "酒店星级", value: "score" },
                    { text: "酒店地址", value: "address" }
				],
				food: [
					{ text: "美食名称", value: "name" }
				]
			},
			mobileHeaders:  {
				hotel: [
					{ text: "酒店名称", value: "name" }
				],
				food: [
					{ text: "美食名称", value: "name" }
				]
			},
			editID: "",
            name: "",
            fieldRules:{
                hotel:{
                    name:[
                        v => v.length > 0 || "酒店名不能为空",
				        v => (v.length > 0 && v.length <= 15) || "酒店名不超过15个字符"
                    ],
                    address:[
                        v => v.length > 0 || "地址不能为空"
                    ],
                                        introduction:[
                        v => v.length > 0 || "介绍不能为空"
                    ]
                }
            },
			nameRules: [
				v => v.length > 0 || "店铺名不能为空",
				v => (v.length > 0 && v.length <= 15) || "店铺名不超过15个字符"
			],
			url: "",
			urlRules: [
				v => v.length > 0 || "店铺链接不能为空",
				v =>
					/^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/.test(v) ||
					"店铺链接不合法"
			],
			file: null
		};
	},
	computed: {
		...mapState(["isMobile"])
	},
	components: {
		MyDialog,
		FileUpload,
		resizeBox
	},
	methods: {
		...mapMutations(["snackBarOpen"]),
		setForm(item) {
			this.name = item.name;
			this.url = item.url;
			this.file = item.img;
		},
		async submit() {
			if (this.$refs.form.validate() && this.file) {
				this.loading++;
				const mutation = this.isCreate
					? gql`
                    mutation{
                        createBusiness(data:{
                            name:"${this.name}",
                            url:"${this.url}",
                            img:{connect:{
                            id:"${this.file.id}"
                            }}
                        }){id}
                    }`
					: gql`
                    mutation{
                        updateBusiness(where:{id:"${this.editID}"},data:{
                            name:"${this.name}",
                            url:"${this.url}",
                            img:{connect:{
                            id:"${this.file.id}"
                            }}}){id}
                    }`;
				try {
					await this.$apollo.mutate({ mutation });
					this.snackBarOpen({
						title: "成功",
						text: `店铺: ${this.name} 操作成功`
					});
					this.$apollo.queries.businesses.refetch();
				} catch (e) {
					this.snackBarOpen({ title: "提交失败", text: e.toString() });
				} finally {
					this.loading--;
					this.dialog = false;
				}
			}
		},
		reset() {
			this.name = "";
			this.url = "";
			this.file = null;
		},
		async del() {
			if (confirm("此操作不可恢复,是否继续进行?")) {
				const mutation = gql`
                mutation{
                deleteBusiness(where:{id:"${this.editID}"}){id}
                }`;
				this.loading++;
				try {
					await this.$apollo.mutate({ mutation });
					this.snackBarOpen({
						title: "成功",
						text: `店铺: ${this.name} 删除成功`
					});
					this.$apollo.queries.businesses.refetch();
				} catch (e) {
					this.snackBarOpen({ title: "提交失败", text: e.toString() });
				} finally {
					this.loading--;
					this.dialog = false;
				}
			}
		}
	},
	apollo: {
		hotels: {
			query: gql`
				{
					hotels {
						id
						name
						address
						introduction
						houses
						score
						url
						img {
							id
							url
						}
					}
				}
			`,
			loadingKey: "loading",
			result(value) {
				if (!value) {
					this.hotels = [];
				}
			}
		},
		foods: {
			query: gql`
				{
					query {
						foods {
							id
							name
							img {
								id
								url
							}
						}
					}
				}
			`,
			loadingKey: "loading",
			result(value) {
				if (!value) {
					this.foods = [];
				}
			}
		}
	}
};
</script>

<style scoped>
</style>
