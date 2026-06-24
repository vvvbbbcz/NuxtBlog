<script setup lang="ts">
import InstallSettings from '~/components/admin/InstallSettings.vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'install'],
});
</script>

<template>
    <el-main class="m-1 p-0">
        <el-card>
            <InstallSettings />
        </el-card>
    </el-main>
</template>

<style scoped></style>
