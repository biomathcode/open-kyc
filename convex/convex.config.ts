import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import workflow from "@convex-dev/workflow/convex.config";
import resend from '@convex-dev/resend/convex.config'
import autumn from "@useautumn/convex/convex.config";





const app = defineApp();
app.use(betterAuth);
app.use(autumn);
app.use(resend)
app.use(workflow);

export default app;