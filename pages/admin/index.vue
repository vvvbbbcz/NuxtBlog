<script setup lang="ts">
import type { TabPaneName } from 'element-plus';
import AsideMenu from '~/components/admin/AsideMenu.vue';

definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
});

const activeTab = ref(-1);
const tabs = ref<AdminTab[]>([]); // tab list
const tabMap = ref<{ [key: string]: number }>({}) // mapping from tab name to index

function addTab(tab: AdminTab) {
    let idx = tabMap.value[tab.name]; // query the index of the tab with the same name

    if (idx === undefined) { // if the tab doesn't exist
        idx = tabs.value.length; // get the index of the new tab
        tabs.value.push(tab); // add the new tab to the list
        tabMap.value[tab.name] = idx; // add the mapping from tab name to index
    }

    activeTab.value = idx; // switch to the existing or new tab
}

provide('addTab', addTab);

function removeTab(index: TabPaneName) {
    if (typeof index === 'string') { // if the index is a string (tab name)
        const idx = tabMap.value[index]; // get the index of the tab with the name
        if (idx === undefined) return; // if the tab does not exist, do nothing
        index = idx
    };

    const tabList = tabs.value
    let active = activeTab.value

    // if the tab to be removed is before the active tab,
    // or if the active tab is the last one and is being removed,
    // we need to adjust the active tab index
    if ((active > index) ||
        (active === index && active === tabList.length - 1)) active--;
    activeTab.value = active

    // remove the mapping of the tab
    const tab = tabList[index]
    if (tab !== undefined) delete tabMap.value[tab.name]

    // remove the tab from the list
    const filtered = tabList.filter((_, i) => i !== index);
    tabs.value = filtered

    // rebuild the mapping for the remaining tabs
    filtered.forEach((tab, i) => tabMap.value[tab.name] = i)
}
</script>

<template>
    <el-aside class="m-1">
        <AsideMenu />
    </el-aside>
    <el-main class="m-1 p-0">
        <el-card>
            <el-tabs v-model="activeTab" type="card" closable @tab-remove="removeTab">
                <el-tab-pane label="欢迎" :name="-1" :key="-1" :closable="false">
                    <p>欢迎来到后台管理中心</p>
                    <p>你可以在左侧菜单栏中进行操作</p>
                </el-tab-pane>
                <el-tab-pane v-for="(item, idx) in tabs" :key="idx" :label="item.label" :name="idx">
                    <KeepAlive>
                        <component :is="registry[item.content]" v-bind="item.props" />
                    </KeepAlive>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </el-main>
</template>

<style scoped>
.el-aside {
    width: 20%;
    max-width: 12rem;
    min-width: 9rem;
}

@media screen and (max-width: 36em) {
    .el-aside {
        width: unset;
        max-width: unset;
        min-width: unset;
    }
}
</style>
