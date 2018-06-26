<template>
    <div>
        {{users}}
    </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
    data() {
        return {
            users: null
        }
    },
    apollo: {
        users: {
            query: gql`{
                 users {
                   role
                   name
                   lastLoginAt
                   createdAt
                 }
            }`
        }
    }
}

</script>

<style scoped>

</style>