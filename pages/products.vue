<template>
    <div>
        <hero :src="require('assets/products/hero.jpg')" title="农产品介绍" subTitle="产品全面，价格透明，全年365天24小时电话，微信预定"></hero>
    </div>
</template>

<script>
import Hero from '@/components/hero.vue'
export default {
    components: {
        Hero
    },
}
</script>

<style scoped>

</style>