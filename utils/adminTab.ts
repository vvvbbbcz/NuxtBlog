import BlogSettings from '~/components/admin/BlogSettings.vue';
import ArticleEditor from '~/components/admin/ArticleEditor.vue';
import ArticleList from '~/components/admin/ArticleList.vue';
import TagList from '~/components/admin/TagList.vue';
import UserList from '~/components/admin/UserList.vue';
import ProfileSettings from '~/components/admin/ProfileSettings.vue';

export const registry = {
    BlogSettings,
    ArticleEditor,
    ArticleList,
    TagList,
    UserList,
    ProfileSettings,
} as const;

export interface AdminTab {
    label: string;
    name: string;
    content: keyof typeof registry;
    props?: Object;
}
