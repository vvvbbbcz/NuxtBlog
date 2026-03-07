<script setup lang="ts">
const { data } = useNuxtData('blogInfo');
const title = data.value?.name ?? 'NuxtBlog'
</script>

<template>
    <span class="site-name">{{ title }}</span>
</template>

<style scoped></style>
