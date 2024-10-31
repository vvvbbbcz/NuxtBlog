<script setup lang="ts">
const {data} = await useFetch('/api/getBlogInfo');
const title = data.value ? data.value.name : '获取博客名称失败'
</script>

<template>

</template>

<style scoped>

</style>