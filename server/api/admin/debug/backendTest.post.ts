export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const num1 = Number(body.num1);
    const num2 = Number(body.num2);

    if (isNaN(num1) || isNaN(num2)) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid input' });
    }

    return apiStatus.success(event, { code: 200, data: { sum: num1 + num2 } })
});
