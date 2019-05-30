<template>
    <v-parallax :src="src" class="hero">
        <v-layout column justify-center align-center>
            <h1>{{title}}</h1>
            <h2>{{subTitle}}</h2>
        </v-layout>
    </v-parallax>
</template>

<script>
export default {
    props: ['title', 'subTitle', 'src']
}
</script> 

<style scoped>
.hero {
    height: 37.6vh;
    width: 100vw;
    text-shadow: 1px 1px 2px black;
}
</style>