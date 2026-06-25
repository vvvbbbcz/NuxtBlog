export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event);

    return apiStatus.success(event, {
        code: 200, data: {
            runtimeConfig: config,
            env: process.env,
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            memoryUsage: process.memoryUsage(),
            uptime: process.uptime(),
            cpuUsage: process.cpuUsage(),
        }
    })
});
