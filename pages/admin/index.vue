<script setup lang="ts">
import type { TabPaneName } from 'element-plus';
import AsideMenu from '~/components/admin/AsideMenu.vue';
import InstallSettings from '~/components/admin/InstallSettings.vue';
import type { User } from '~/utils/dbTypes/user';

definePageMeta({
    layout: 'admin',
    middleware: ['auth'],
});

const { user }: { user: ComputedRef<User | null> } = useUserSession();

interface Tab {
    label: string;
    name: string;
    content: any;
    props?: Object;
}

const activeTab = ref(-1);

const tabs = ref<Tab[]>([]);

const tabMap = ref<{ [key: string]: number }>({})

function addTab(tab: Tab) {
    const idx = tabMap.value[tab.name];
    if (idx !== undefined) {
        activeTab.value = idx;
    } else {
        const tail = tabs.value.length;

        tabs.value.push(tab);
        tabMap.value[tab.name] = tail
        activeTab.value = tail;
    }
}

function removeTab(index: TabPaneName) {
    if (typeof index === 'string') {
        const idx = tabMap.value[index];
        if (idx === undefined) return;
        index = idx
    };

    const tabList = tabs.value
    let active = activeTab.value

    if ((active > index) ||
        (active === index && active === tabList.length - 1)) active--;
    activeTab.value = active

    const filtered = tabList.filter((_, i) => i !== index);
    tabs.value = filtered

    const tab = tabList[index]
    if (tab !== undefined) delete tabMap.value[tab.name]

    filtered.forEach((tab, i) => tabMap.value[tab.name] = i)
}
</script>

<template>
    <el-aside class="m-1">
        <AsideMenu :add-tab="addTab" />
    </el-aside>
    <el-main class="m-1 p-0">
        <el-card>
            <InstallSettings v-if="user?.id === 0" />

            <el-tabs v-model="activeTab" closable @tab-remove="removeTab">
                <el-tab-pane label="欢迎" :name="-1" :key="-1" :closable="false">
                    <p>欢迎来到后台管理中心</p>
                    <p>你可以在左侧菜单栏中进行操作</p>
                </el-tab-pane>
                <el-tab-pane v-for="(item, idx) in tabs" :key="idx" :label="item.label" :name="idx">
                    <KeepAlive>
                        <component :is="item.content" v-bind="item.props" />
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
