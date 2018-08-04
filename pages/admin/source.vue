<template>
    <v-container>
        <v-subheader>全部美食</v-subheader>
        <v-card>
            <v-data-table :headers="isMobile ? mobileHeaders.food : headers.food" :loading="loading>0" :items="foods" hide-actions>
                <template slot="items" slot-scope="props">
                    <tr @click="setFoodForm(props.item); isCreate = false;dialog.food = true;editID=props.item.id" style="cursor:pointer">
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
            <v-btn open-on-hover color="primary" :block="isMobile" @click="reset();isCreate = true; dialog.food = true">新增</v-btn>
        </v-layout>
        <v-subheader>全部酒店</v-subheader>
        <v-card>
            <v-data-table :headers="isMobile ? mobileHeaders.hotel : headers.hotel" :loading="loading>0" :items="hotels" hide-actions>
                <template slot="items" slot-scope="props">
                    <tr @click="setHotelForm(props.item); isCreate = false;dialog.hotel = true;editID=props.item.id" style="cursor:pointer">
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
            <v-btn open-on-hover color="primary" :block="isMobile" @click="reset();isCreate = true; dialog.hotel = true">新增</v-btn>
        </v-layout>











        <my-dialog :title="isCreate ? '添加美食' : '更新美食信息'" v-model="dialog.food" @submit="submit_food" :loading="this.loading>0">
            <v-form ref="food_form">
                <v-text-field v-model="name" :rules="fieldRules.food.name" :counter="15" label="美食名"></v-text-field>
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
            <v-btn v-if="!isCreate" class="my-3" color="error" @click="delFood">删除美食</v-btn>
        </my-dialog>

        <my-dialog :title="isCreate ? '添加酒店' : '更新酒店信息'" v-model="dialog.hotel" @submit="submit_hotel" :loading="this.loading>0">
            <v-form ref="hotel_form">
                <v-text-field v-model="name" :rules="fieldRules.hotel.name" :counter="15" label="酒店名"></v-text-field>
                <v-text-field v-model="address" :rules="fieldRules.hotel.address" label="酒店地址"></v-text-field>
                 <v-slider style="margin-top:2em;" v-model="score"  thumb-label="always" :max="5" :min="1" label="酒店星级"></v-slider>
                <v-textarea v-model="introduction" :rules="fieldRules.hotel.introduction"  label="酒店介绍"></v-textarea>

                <v-text-field v-model="url" :rules="urlRules" label="酒店链接"></v-text-field>


                  <v-subheader style="padding:0">房型信息</v-subheader>
                  <div class="house-card-container">
                    <v-card class="house-card" v-for="(item,index) in houses" :key="item.name">
                      <v-card-text>
                      <v-text-field label="房型" :rules="fieldRules.house.name" v-model="item.name" />
                      <v-text-field label="价格" :rules="fieldRules.house.price" v-model="item.price" />
                      </v-card-text>
                      <v-card-actions style="justify-content: flex-end;">
                          <v-btn  outline color="primary" @click="rmHouse(index)" >删除</v-btn>
                        </v-card-actions>
                    </v-card>
                      <v-card class="house-card">
                      <v-card-text>
                      <v-form ref="house_form">
                      <v-text-field ref="houseAddName" :rules="fieldRules.house.name" label="房型" placeholder="大床房" />
                      <v-text-field  ref="houseAddPrice"  :rules="fieldRules.house.price" label="价格" placeholder="1800" />
                      </v-form>
                      </v-card-text>

                      <v-card-actions style="justify-content: flex-end;">
                          <v-btn  color="primary" @click="addHouse">新增</v-btn>
                        </v-card-actions>
                    </v-card>
                  </div>

                <v-layout column>
                    <v-subheader class="pl-0">{{isCreate ? '点击上传酒店图片' : '点击更新酒店图片'}}</v-subheader>
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
            <v-btn v-if="!isCreate" class="my-3" color="error" @click="delHotel">删除此酒店</v-btn>
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
				food: [{ text: "美食名称", value: "name" }]
			},
			mobileHeaders: {
				hotel: [{ text: "酒店名称", value: "name" }],
				food: [{ text: "美食名称", value: "name" }]
			},
			editID: "",
			name: "",
			introduction: "",
			_houses: [],
			get houses() {
				return this._houses;
			},
			set houses(payload) {
        console.log(payload)
				if (typeof payload === "string") {
					this._houses = JSON.parse(payload);
				} else this._houses = payload;
			},
			address: "",
			score: 0,
			fieldRules: {
				hotel: {
					name: [
						v => (v && v.length > 0) || "酒店名不能为空",
						v => (v && v.length > 0 && v.length <= 15) || "酒店名不超过15个字符"
					],
					address: [v => (v && v.length > 0) || "地址不能为空"],
					introduction: [v => (v && v.length > 0) || "介绍不能为空"]
				},
				food: {
					name: [
						v => (v && v.length > 0) || "美食不能为空",
						v => (v && v.length > 0 && v.length <= 15) || "美食名不超过15个字符"
					]
				},
				house: {
					name: [
						v => (v && v.length > 0) || "房型名称不能为空",
						v =>
							(v && v.length > 0 && v.length <= 15) || "房型名称不超过15个字符"
					],
					price: [v => !isNaN(v) || "房型价格只能为数字"]
				}
			},
			url: "",
			urlRules: [
				v => (v && v.length > 0) || "店铺链接不能为空",
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
		setFoodForm(item) {
			this.name = item.name;
			this.url = item.url;
			this.file = item.img;
		},
		setHotelForm(item) {
			this.name = item.name;
      this.address = item.address;
      this.houses = JSON.parse(item.houses);
      this.introduction = item.introduction;
			this.score = item.score;
			this.url = item.url;
			this.file = item.img;
		},
		addHouse() {
			if (this.$refs.house_form.validate()) {
				this.houses.push({
					name: this.$refs.houseAddName.internalValue,
					price: this.$refs.houseAddPrice.internalValue
				});
				this.$refs.houseAddName.internalValue = "";
				this.$refs.houseAddPrice.internalValue = 0;
			}
		},
		rmHouse(index) {
			this.houses.splice(index, 1);
		},
		async submit_food() {
			if (this.$refs.food_form.validate() && this.file) {
				this.loading++;
				const mutation = this.isCreate
					? gql`
                    mutation{
                        createFood(data:{
                            name:"${this.name}",
                            img:{connect:{
                            id:"${this.file.id}"
                            }}
                        }){id}
                    }`
					: gql`
                    mutation{
                        updateFood(where:{id:"${this.editID}"},data:{
                            name:"${this.name}",
                            img:{connect:{
                            id:"${this.file.id}"
                            }}}){id}
                    }`;
				try {
					await this.$apollo.mutate({ mutation });
					this.snackBarOpen({
						title: "成功",
						text: `美食: ${this.name} 操作成功`
					});
					this.$apollo.queries.businesses.refetch();
				} catch (e) {
					this.snackBarOpen({ title: "提交失败", text: e.toString() });
				} finally {
					this.loading--;
					this.dialog.food = false;
				}
			}
		},
		async submit_hotel() {
			console.log(this.$refs.hotel_form.validate());
			if (this.$refs.hotel_form.validate() && this.file) {
				this.loading++;
				const mutation = this.isCreate
					? gql`
                    mutation($houses: String!){
                        createHotel(data:{
                            name:"${this.name}",
                            address:"${this.address}",
                            introduction:"${this.introduction}",
                            houses: $houses,
                            score:${this.score},
                            url:"${this.url}",
                            img:{connect:{
                            id:"${this.file.id}"
                            }}
                        }){id}
                    }`
					: gql`
                    mutation($houses: String!){
                        updateHotel(where:{id:"${this.editID}"},data:{
                            name:"${this.name}",
                            address:"${this.address}",
                            introduction:"${this.introduction}",
                            houses: $houses,
                            score:${this.score},
                            url:"${this.url}",
                            img:{connect:{
                            id:"${this.file.id}"
                          }}
                        }){id}
                    }`;
				try {
					await this.$apollo.mutate({
						mutation,
						variables: { houses: JSON.stringify(this.houses) }
					});
					this.snackBarOpen({
						title: "成功",
						text: `酒店: ${this.name} 操作成功`
					});
					this.$apollo.queries.hotels.refetch();
				} catch (e) {
					this.snackBarOpen({ title: "提交失败", text: e.toString() });
				} finally {
					this.loading--;
					this.dialog.hotel = false;
				}
			}
		},
		reset() {
			this.name = "";
			this.url = "";
			this.address = "";
			this.introduction = "";
			this.score = 0;
			this.houses = [];
			this.file = null;
		},
		async delFood() {
			if (confirm("此操作不可恢复,是否继续进行?")) {
				const mutation = gql`
                mutation{
                deleteFood(where:{id:"${this.editID}"}){id}
                }`;
				this.loading++;
				try {
					await this.$apollo.mutate({ mutation });
					this.snackBarOpen({
						title: "成功",
						text: `美食: ${this.name} 删除成功`
					});
					this.$apollo.queries.foods.refetch();
				} catch (e) {
					this.snackBarOpen({ title: "提交失败", text: e.toString() });
				} finally {
					this.loading--;
					this.dialog.food = false;
				}
			}
		},		async delHotel() {
			if (confirm("此操作不可恢复,是否继续进行?")) {
				const mutation = gql`
                mutation{
                deleteHotel(where:{id:"${this.editID}"}){id}
                }`;
				this.loading++;
				try {
					await this.$apollo.mutate({ mutation });
					this.snackBarOpen({
						title: "成功",
						text: `酒店: ${this.name} 删除成功`
					});
					this.$apollo.queries.businesses.refetch();
				} catch (e) {
					this.snackBarOpen({ title: "提交失败", text: e.toString() });
				} finally {
					this.loading--;
					this.dialog.hotel = false;
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
					foods {
						id
						name
						img {
							id
							url
						}
					}
				}
			`,
			loadingKey: "loading",
			result(value) {
				console.log(value);
				if (!value) {
					this.foods = [];
				}
			}
		}
	}
};
</script>

<style scoped>
.house-card-container {
	display: flex;
	flex-flow: row wrap;
}
.house-card {
	width: 240px;
	margin: 10px;
}
</style>
