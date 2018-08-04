<template>

    <div>
        <label for="file" style="display:inline-block;cursor:pointer" class="btn btn--outline btn--depressed primary--text" v-ripple>
            <v-layout class="btn__content">
                <v-progress-circular v-if="loading>0" indeterminate color="primary" size="16"></v-progress-circular>
                <slot v-else></slot>
            </v-layout>
        </label>
        <input ref="referenceUpload" type="file" name="file" id="file" style="display:none" :accept="accept" @change="onUpload">
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    props: {
        accept: {
            type: String,
            default: "*"
        },
    },
    data() {
        return {
            loading: 0,
            switcher:true
        }
    },
    methods: {
        ...mapMutations(['snackBarOpen']),
        async onUpload({ target: { validity, files: [file] } }) {
            this.$refs.referenceUpload.value = null;//reset input value
            if (validity.valid && file) {
                this.loading += 1
                try {
                    this.$emit('input', await this.$upload(file))
                }
                catch (e) {
                    this.snackBarOpen({
                        title: "上传失败",
                        text: e.toString()
                    })
                }
                finally {
                    this.loading -= 1
                }
            }
        }
    },

}
</script>

<style scoped>

</style>
