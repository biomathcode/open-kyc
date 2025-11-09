import { v } from "convex/values";
import { mutation } from "./../_generated/server";
import { authComponent, createAuth } from "./../auth";

export const updateUserPassword = mutation({
    args: {
        currentPassword: v.string(),
        newPassword: v.string(),
    },
    handler: async (ctx, args) => {
        const { auth, headers } = await authComponent.getAuth(createAuth, ctx);
        await auth.api.changePassword({
            body: {
                currentPassword: args.currentPassword,
                newPassword: args.newPassword,
            },
            headers,
        });
    },
});