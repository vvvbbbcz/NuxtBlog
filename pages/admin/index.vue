<script setup lang="ts">
import type { User } from '~/utils/dbTypes/user';

definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
});

const { user }: { user: ComputedRef<User | null> } = useUserSession();
</script>

<template>
    <el-card>
        <AdminInstallSettings v-if="user?.id === 0" />
    </el-card>
</template>

<style scoped></style>
