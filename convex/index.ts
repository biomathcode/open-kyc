/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { WorkflowManager } from "@convex-dev/workflow";
import { v } from "convex/values";

import { components, internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";



export const workflow = new WorkflowManager(components.workflow, {
    workpoolOptions: {
        defaultRetryBehavior: {
            maxAttempts: 3,
            initialBackoffMs: 100,
            base: 2,
        },
        retryActionsByDefault: true,
    }
});

export const applyExtractedInfoToSession = mutation({
    args: {
        sessionId: v.id("sessions"),
        extracted: v.any(),
    },

    handler: async (ctx, { sessionId, extracted }) => {
        await ctx.db.patch(sessionId, {
            ...extracted,
            updatedAt: Date.now(),
        });
    },
});


export const extractInformationWorkflow = workflow.define({
    args: {
        sessionId: v.id("sessions"),
        front_image: v.id("_storage"),
        back_image: v.id("_storage"),
    },
    returns: v.any(),
    handler: async (step, { front_image, back_image, sessionId }): Promise<any> => {
        const extracted = await step.runAction(
            internal.tools.extractInformation,
            { front_image: front_image, back_image: back_image }
        );

        await step.runMutation(
            internal.helpers.internalUpdateSession,
            {
                sessionId: sessionId,
                updates: {
                    ...extracted,
                },
            }
        );

        if (!extracted.first_name && !extracted.last_name) {
            throw new Error("No extracted data found")
        }

        const name = `${extracted.first_name} ${extracted.last_name}`

        const getNews = await step.runAction(
            internal.tools.searchName,
            {
                name
            }
        )

        if (!getNews.web || getNews.web.length === 0) {
            throw new Error("No News Result found");
        }

        // Normalize all results to your schema type
        const formatted = getNews.web.map((item, index) => ({
            url: (item as any).url ?? "",
            title: (item as any).title ?? "",
            description: (item as any).description ?? "",
            position: index + 1,
        }));


        await step.runMutation(
            internal.helpers.internalUpdateSession,
            {
                sessionId: sessionId,
                updates: {
                    news_results: formatted
                },
            }
        );

        return extracted;
    }
})


export const extractPersonGenderWorkflow = workflow.define({
    args: {
        sessionId: v.id("sessions"),
        person_image: v.id("_storage"),
    },
    returns: v.any(),
    handler: async (step, args): Promise<any> => {
        const genderInfo = await step.runAction(
            internal.tools.extractPersonGender,
            {
                person_image: args.person_image,
            }
        );

        await step.runMutation(
            internal.helpers.internalUpdateSession,
            {
                sessionId: args.sessionId,
                updates: {
                    ...genderInfo
                },
            }
        );



        return genderInfo;
    },
});


export const siteScrapeAndAnalyzeWorkflow = workflow.define({
    args: { siteUrl: v.string() },
    returns: v.any(),
    handler: async (step, args): Promise<any> => {
        try {
            // 1) Search for related pages
            const foundUrls = await step.runAction(internal.tools.searchPages, {
                siteUrl: args.siteUrl,
            });

            console.log("foundURLS", foundUrls)

            // ensure unique & include root URL
            const targetUrls = Array.from(
                new Set([args.siteUrl, ...foundUrls])
            ).slice(0, 8);

            // 2) Scrape all pages
            let aggregatedMarkdown = await step.runAction(
                internal.tools.scrapeMulti,
                { urls: targetUrls }
            );


            // Fallback: scrape root
            if (!aggregatedMarkdown || aggregatedMarkdown.trim().length < 20) {
                const rootDoc = await step.runAction(internal.tools.scrapeRoot, {
                    siteUrl: args.siteUrl,
                });
                aggregatedMarkdown = rootDoc.markdown ?? rootDoc.html ?? "";
            }



            // store stage
            await step.runMutation(internal.helpers.storeScrapeResult, {
                siteUrl: args.siteUrl,
                workflowId: step.workflowId,
                analysis: { stage: "scraped", ts: Date.now() },

                companyName: "",
                incorporationNumber: "",
                jurisdiction: "",
                registeredAddress: "",
                operationalAddresses: [],
                emails: [],
                phones: [],
                websites: [],

                directors: [],
                ownership: "",
                businessActivities: [],
                paymentMethods: [],

                privacyPolicyText: "",
                termsText: "",
                socialLinks: [],

                registrationDates: {
                    incorporationDate: "",
                },

                amlRiskScore: 1,
                amlRiskCategory: "",
                amlRecommendedState: "",
                detectedIssues: [],
                suggestedNextSteps: [],
                amlNotes: "",

                status: "pending",
            });
            // 3) Extract business details
            const details = await step.runAction(internal.tools.extractBusinessDetails, {
                siteContent: aggregatedMarkdown,
                siteUrl: args.siteUrl,
            });

            console.log("details", details)

            // 4) AML check
            const aml = await step.runAction(internal.tools.amlCheck, {
                businessDetails: details,
                siteContent: aggregatedMarkdown,
                siteUrl: args.siteUrl,
            });


            const newJson = {
                companyName: details.companyName,
                incorporationNumber: details.incorporationNumber,

            }

            console.log("aml Details", newJson)



            // 5) Persist final result
            await step.runMutation(internal.helpers.storeScrapeResult, {
                siteUrl: args.siteUrl,
                workflowId: step.workflowId,
                analysis: JSON.stringify({ stage: "complete", ts: Date.now() }),
                companyName: details.companyName || "",
                incorporationNumber: details.incorporationNumber || "",
                jurisdiction: details.jurisdiction || "",
                registeredAddress: details.registeredAddress || "",
                operationalAddresses: details.operationalAddresses,
                emails: details.emails,
                phones: details.phones,
                websites: details.websites,
                directors: details.directors.map((d) => ({
                    name: d.name ?? "",
                    role: d.role ?? "",
                })),
                ownership: details.ownership || "",
                businessActivities: details.businessActivities,
                paymentMethods: details.paymentMethods,
                privacyPolicyText: details.privacyPolicyText || "",
                termsText: details.termsText || "",
                socialLinks: details.socialLinks,
                registrationDates: {
                    incorporationDate: details.registrationDates.incorporationDate ?? "",
                },

                amlRiskScore: aml.riskScore,
                amlRiskCategory: aml.riskCategory,
                amlRecommendedState: aml.recommendedState,
                detectedIssues: aml.detectedIssues,
                suggestedNextSteps: aml.suggestedNextSteps,
                amlNotes: aml.notes || "",

                status: aml.recommendedState,
            });

            return { businessDetails: details, aml };
        } catch (err) {
            // store failure
            await step.runMutation(internal.helpers.storeScrapeResult, {
                siteUrl: args.siteUrl,
                workflowId: step.workflowId,
                analysis: JSON.stringify({
                    stage: "error",
                    error: String(err),
                    ts: Date.now(),
                }),
                status: "error",

                // Business details placeholders
                companyName: "",
                incorporationNumber: "",
                jurisdiction: "",
                registeredAddress: "",
                operationalAddresses: [],
                emails: [],
                phones: [],
                websites: [],

                directors: [],
                ownership: "",
                businessActivities: [],
                paymentMethods: [],

                privacyPolicyText: "",
                termsText: "",
                socialLinks: [],

                registrationDates: {
                    incorporationDate: "",
                },
                // AML placeholders
                amlRiskScore: 1,
                amlRiskCategory: "",
                amlRecommendedState: "",
                detectedIssues: [],
                suggestedNextSteps: [],
                amlNotes: "",


            });

            throw err;
        }
    },
});






export const kickoffWorkflow = mutation({
    args: { siteUrl: v.string() },
    handler: async (ctx, args): Promise<string> => {
        const workflowId = await workflow.start(
            ctx,
            internal.index.siteScrapeAndAnalyzeWorkflow,
            { siteUrl: args.siteUrl },
            {
                context: { name: args.siteUrl },
            },
        );

        //  Store a placeholder entry immediately so we can track the workflow
        //  even before it completes and stores results
        await ctx.db.insert("siteAnalysis", {
            siteUrl: args.siteUrl,
            workflowId: workflowId as string,
            analysis: "",
            status: "",
            companyName: "",
            incorporationNumber: "",
            jurisdiction: "",
            registeredAddress: "",
            operationalAddresses: [],
            emails: [],
            phones: [],
            websites: [],

            directors: [],
            ownership: "",
            businessActivities: [],
            paymentMethods: [],

            privacyPolicyText: "",
            termsText: "",
            socialLinks: [],

            registrationDates: {
                incorporationDate: "",
            },



            amlRiskScore: 1,
            amlRiskCategory: "",
            amlRecommendedState: "",
            detectedIssues: [],
            suggestedNextSteps: [],
            amlNotes: "",

        });

        return workflowId;
    },
});


export const getWorkflowStatus = query({
    args: { workflowId: v.string() },
    returns: v.object({
        isRunning: v.boolean(),
        isComplete: v.boolean(),
        hasFailed: v.boolean(),
        error: v.optional(v.string()),
        inProgress: v.array(v.any()),
        journalEntries: v.array(v.any()),
        workflow: v.any(),
    }),
    handler: async (ctx, args) => {
        const status = await ctx.runQuery(components.workflow.journal.load, {
            workflowId: args.workflowId,
        });

        const isComplete = !!status.workflow.runResult;
        const hasFailed = status.workflow.runResult?.kind === "failed";
        const error = status.workflow.runResult?.kind === "failed"
            ? status.workflow.runResult.error
            : "";
        const isRunning = status.journalEntries.length > 0 && !isComplete;

        return {
            isRunning,
            isComplete,
            hasFailed,
            error,
            inProgress: status.journalEntries.filter((entry) => entry.step.inProgress).map((entry) => entry.step),
            journalEntries: status.journalEntries,
            workflow: status.workflow,
        };
    },
});

//  Get all active workflow IDs from results
export const getActiveWorkflowIds = query({
    args: {},
    handler: async (ctx) => {
        const results = await ctx.db.query("siteAnalysis").collect();
        const workflowIds = new Set<string>();

        //  Check which workflows are still active
        for (const result of results) {
            try {
                const status = await ctx.runQuery(components.workflow.journal.load, {
                    workflowId: result.workflowId,
                });
                const isComplete = !!status.workflow.runResult;
                if (!isComplete) {
                    workflowIds.add(result.workflowId);
                }
            } catch {
                //  If we can't load the workflow, skip it
            }
        }

        return Array.from(workflowIds);
    },
});