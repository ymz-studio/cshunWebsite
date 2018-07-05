<template>
    <div>
        <hero :src="require('assets/consultant/hero.jpg')" title="专家咨询" subTitle="信息广泛，全方面助力您的生产"></hero>
        <v-container>
            <file-upload></file-upload>
        </v-container>
    </div>
</template>

<script>
import Hero from '@/components/hero'
import FileUpload from '@/components/file-upload'
export default {
    components: {
        Hero,
        FileUpload
    }
}
</script>

<style scoped>

</style>