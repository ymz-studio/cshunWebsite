<template>
    <div ref="box" :style="{height:curHeight,width:'100%'}">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        rate: {
            type: Number,
            default: 16 / 9
        }
    },
    data() {
        return {
            curHeight: null
        }
    },
    methods: {
        setHeight() {
            this.curHeight = this.$refs.box ? (this.$refs.box.clientWidth / this.rate).toString() + 'px' : 0
        }
    },
    mounted() {
        window.addEventListener('resize', this.setHeight)
        this.$nextTick(() => {
            this.setHeight()
            this.$refs.box.style.height = this.curHeight
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.setHeight)
    },
}
</script>

<style scoped>

</style>