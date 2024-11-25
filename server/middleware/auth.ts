export default defineEventHandler(async (event) => {
	if (event.path.split('/', 3)[2] === 'admin') {
		await requireUserSession(event);
	}
});
