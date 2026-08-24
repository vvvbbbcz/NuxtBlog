import { consola } from "consola";
import mongoose from "mongoose";
import BlogData from "~/server/utils/models/BlogData";

export default defineNitroPlugin(async (nitroApp) => {
    const config = useRuntimeConfig();

    mongoose.connection.once('open', () => {
        consola.success('Connected to MongoDB');
    });

    mongoose.connection.once('close', () => {
        consola.info('MongoDB disconnected');
    });

    nitroApp.hooks.hook('close', () => {
        mongoose.disconnect();
    });

    const models = [BlogData];
    consola.info(`Loaded ${models.length} Mongoose model(s)`);

    try {
        mongoose.set('strictQuery', true);
        await mongoose.connect(config.blog.mongodb.uri, { dbName: config.blog.mongodb.database });
    } catch (error) {
        consola.error(`Error connecting to MongoDB: ${error}`);
    }
});
