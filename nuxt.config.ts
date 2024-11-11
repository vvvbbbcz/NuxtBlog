// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: {
		enabled: true,

		timeline: {
			enabled: true
		}
	},
	modules: [
		'@element-plus/nuxt',
		'nuxt-mongoose',
		'nuxt-auth-utils'
	],
	app: {
		head: {
			htmlAttrs: {
				lang: 'zh-CN'
			},
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1',
		}
	}
})