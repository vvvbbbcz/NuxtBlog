<script setup lang="ts">
definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'install'],
});

const activeTab = ref(0);

async function baseInfoFetch() {
    await $fetch('/api/admin/debug/baseInfo', {
        method: 'GET'
    }).then(({ data }: any) => {
        console.log(data);
    }).catch((err) => {
        console.log(err);
    });
}

const backendLogs = ref<string[]>([]);
const num1 = ref(0);
const num2 = ref(0);
async function backendTestSubmit() {
    await $fetch('/api/admin/debug/backendTest', {
        method: 'POST',
        body: { num1: num1.value, num2: num2.value }
    }).then(({ data }: any) => {
        backendLogs.value.push(`Sum: ${data.sum}`);
    }).catch((err) => {
        backendLogs.value.push(`${err}`);
    });
}

const dbLogs = ref<string[]>([]);
const dbConnectionString = ref('');
async function dbTestSubmit() {
    await $fetch('/api/admin/debug/databaseTest', {
        method: 'POST',
        body: { connectionString: dbConnectionString.value }
    }).then(({ data }: any) => {
        dbLogs.value.push(...data.logs);
    }).catch((err) => {
        dbLogs.value.push(`${err}`);
    });
}
</script>

<template>
    <el-main class="m-1 p-0">
        <el-card>
            <el-tabs v-model="activeTab" type="card">
                <el-tab-pane label="基本信息" :name="0">
                    <el-button @click="baseInfoFetch">Fetch</el-button>
                </el-tab-pane>

                <el-tab-pane label="后端测试" :name="1">
                    <el-input-number class="m-r-1" v-model="num1" :min="0" :max="100" />
                    <el-input-number class="m-r-1" v-model="num2" :min="0" :max="100" />
                    <el-button @click="backendTestSubmit">Submit</el-button>

                    <div class="m-t-1">
                        <p v-for="log in backendLogs" class="m-0">{{ log }}</p>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="数据库测试" :name="2">
                    <el-input class="m-b-1" v-model="dbConnectionString" />
                    <el-button @click="dbTestSubmit">Submit</el-button>

                    <div class="m-t-1">
                        <p v-for="log in dbLogs" class="m-0">{{ log }}</p>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </el-main>
</template>

<style scoped></style>
