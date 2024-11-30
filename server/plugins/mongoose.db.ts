import consola from "consola";
import mongoose from "mongoose";
import BlogData from "~/server/utils/models/BlogData";

export default defineNitroPlugin(async (nitroApp) => {
	mongoose.connection.once('open', () => {
		consola.success('Connected to MongoDB');
	});

	mongoose.connection.once('close', () => {
		consola.info('MongoDB disconnected');
	});

	nitroApp.hooks.hook('close', () => {
		mongoose.disconnect();
	});

	if (!process.env.MONGODB_URI) {
		consola.warn('No MONGODB_URI found in env');
		return;
	} else if (!process.env.MONGODB_DB_NAME) {
		consola.warn('No MONGODB_DB_NAME found in env');
		return;
	}

	const models = [BlogData];
	consola.info(`Loaded ${models.length} Mongoose model(s)`);

	try {
		await mongoose.connect(process.env.MONGODB_URI, {dbName: process.env.MONGODB_DB_NAME});
	} catch (error) {
		consola.error(`Error connecting to MongoDB: ${error}`);
	}
});