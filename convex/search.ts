import { v } from "convex/values";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const publicSearch = action({
    args: { name: v.string() },

    handler: async (
        ctx,
        { name }
    ): Promise<any> => {
        const result: any = await ctx.runAction(
            internal.tools.searchName,
            { name }
        );


        return result;
    },
});
