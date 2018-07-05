<template>

    <div>
        <input type="file" @change="onUpload">
        <img v-if="url" :src="url">
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: 0,
            url: ""
        }
    },
    methods: {
        async onUpload({ target: { validity, files: [file] } }) {
            if (validity.valid) {
                this.url = (await this.$upload(file)).url
            }
        }
    },

}
</script>

<style scoped>

</style>