<template>

    <v-dialog v-model="dialog" :fullscreen="isMobile" max-width="70%" persistent>
        <v-card tile>
            <v-card-title>
                <h3>{{title}}</h3>
            </v-card-title>
            <v-card-text>
                <slot></slot>
            </v-card-text>
            <v-card-actions>
                <v-layout justify-end :column="isMobile" class="ma-0" :class="{'px-3':isMobile}" align-center>
                    <v-btn outline color="primary" :block="isMobile" :class="{'mb-2':isMobile}" @click="dialog=false">取消</v-btn>
                    <v-btn color="primary" :block="isMobile" @click="$emit('submit')" :loading="loading">保存</v-btn>
                </v-layout>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
export default {
    props: {
        title: {
            type: String,
            required: true
        },
        value: {
            type: Boolean,
            required: true
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState(['isMobile']),
        dialog: {
            get() {
                return this.value
            },
            set(newValue) {
                this.$emit('input', newValue)
            }
        }
    },

}
</script>

<style scoped>

</style>