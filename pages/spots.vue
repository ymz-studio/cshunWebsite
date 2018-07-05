<template>
    <div>
        <hero :src="require('assets/spots/hero.jpg')" title="旅游景点" subTitle="为您规划最合理的观光路线"></hero>
    </div>
</template>

<script>
import Hero from '@/components/hero'
    export default {
        components:{
            Hero
        }
    }
</script>

<style scoped>

</style>