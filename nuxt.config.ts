// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: {enabled: true},
	modules: ['@element-plus/nuxt', 'nuxt-mongoose', '@sidebase/nuxt-auth'],
	app: {
		head: {
			htmlAttrs: {
				lang: 'zh-CN'
			},
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
		}
	},
	auth: {
		baseURL: '/api/admin/auth',
		provider: {
			type: 'local',
			endpoints: {
				signIn: {path: '/login', method: 'post'},
				signOut: {path: '/logout', method: 'post'},
				signUp: false,
				getSession: {path: '/session', method: 'get'},
			}
		}
	}
})