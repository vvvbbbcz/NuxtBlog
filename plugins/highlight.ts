import hljs from "highlight.js";

export default defineNuxtPlugin(async nuxtApp => {
	nuxtApp.vueApp.directive('highlight', function (element) {
		const blocks = element.querySelectorAll('pre code')
		for (const block of blocks) {
			hljs.highlightElement(block);
		}
	});
})