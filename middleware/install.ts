import type { User } from "~/utils/dbTypes/user";

export default defineNuxtRouteMiddleware((to, from) => {
    const { user }: { user: ComputedRef<User | null> } = useUserSession();
    if (user.value?.id !== undefined && user.value.id < 0) {
        return abortNavigation();
    }
});
