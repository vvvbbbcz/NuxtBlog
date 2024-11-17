import consola from "consola";
import Article from "~/server/utils/models/Article";
import ArticleContent from "~/server/utils/models/ArticleContent";
import BlogInfo from "~/server/utils/models/BlogInfo";
import Markdown from "~/server/utils/models/Markdown";
import Picture from "~/server/utils/models/Picture";
import Tag from "~/server/utils/models/Tag";
import User from "~/server/utils/models/User";

export default defineNitroPlugin((): void => {
	const models = [
		Article,
		ArticleContent,
		BlogInfo,
		Markdown,
		Picture,
		Tag,
		User
	];
	consola.info(`Registered ${models.length} Mongoose model(s)`);
})