"use node";
import Firecrawl from '@mendable/firecrawl-js';
import { v } from 'convex/values';
import { GoogleGenAI } from "@google/genai";


import { internalAction } from './_generated/server';




// You can fetch data from and send data to third-party APIs via an action:
export const scrapeSite = internalAction({
    // Validators for arguments.
    args: {
        siteUrl: v.string(),
    },

    // Action implementation.
    handler: async (_, args) => {
        const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! });

        const doc = await firecrawl.scrape(args.siteUrl, { formats: ['markdown', 'html'] });

        return doc;
    },
})

export const searchName = internalAction({
    // Validators for arguments.
    args: {
        name: v.string(),
    },

    // Action implementation.
    handler: async (_, args) => {
        const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY! });

        const doc = await firecrawl.search(args.name, {
            scrapeOptions: { formats: ['markdown'] },
            timeout: 120000,
            limit: 3
        });

        return doc;
    },
})

export const analyzeSite = internalAction({
    args: { siteContent: v.string() },
    handler: async (_, args) => {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const prompt = `
You are an expert web content analyzer.
Analyze the following website content and return a concise analysis (summary, key topics, and suggested keywords):

${args.siteContent}
    `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    },
});