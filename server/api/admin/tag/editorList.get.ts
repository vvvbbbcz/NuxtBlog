import Tag from "~/server/utils/models/BlogData";
import filters from "~/server/utils/filters";
import { fromDB } from "~/utils/dbTypes/tag";

export default defineEventHandler(async () => {
    return (await Tag.find(filters.tag())
        .limit(20)
        .sort({ _id: -1 })
        .select('ti')
        .lean())
        .map(fromDB)
        .filter((i) => i !== null);
});
