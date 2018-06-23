<template>
    <v-container grid-list-md>
        <v-layout column align-center>
            <h2 class="my-4">
                <slot name="title"></slot>
            </h2>
            <v-layout row wrap justify-center>
                <v-flex d-flex sm12 md6>
                    <slot name="left"></slot>
                </v-flex>
                <v-flex d-flex sm12 md6>
                    <slot name="right"></slot>
                </v-flex>
            </v-layout>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'halfContainer',
}
</script>

<style scoped>

</style>