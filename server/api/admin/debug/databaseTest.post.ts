import mongoose from "mongoose";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const logs: string[] = [];
    const connectionString = String(body.connectionString);
    logs.push(`Received connection string: ${connectionString}`);

    logs.push(`Current connections: ${mongoose.connections.length}`);

    const connection = mongoose.createConnection(connectionString);
    connection.once('open', (arg) => {
        logs.push(`Connected to MongoDB, ${arg}`);
    });

    connection.once('close', (arg) => {
        logs.push(`MongoDB disconnected, ${arg}`);
    });

    await new Promise((resolve) => {
        setTimeout(() => {
            logs.push('Waiting for 5 seconds');
            resolve(true);
        }, 5000);
    });

    await connection.destroy(true);
    logs.push('Connection destroyed');

    return apiStatus.success(event, { code: 200, data: { logs } })
});
