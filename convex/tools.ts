"use node";
import Firecrawl from '@mendable/firecrawl-js';
import { v } from 'convex/values';
import { GoogleGenAI } from "@google/genai";

import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";



import { internalAction } from './_generated/server';



export const kycExtractSchema = z.object({
    first_name: z.string().optional().default(""),
    last_name: z.string().optional().default(""),
    dob: z.string().optional().default(""),
    nationality: z.string().optional().default(""),
    issuing_state: z.string().optional().default(""),
    address: z.string().optional().default(""),
    document_number: z.string().optional().default(""),
    document_type: z.string().optional().default(""),
});


export const genderSchema = z.object({
    // gender: z.string().optional().default(""),

})

async function base64Converter(blob: any) {

    if (!blob) throw new Error("Image not found");
    // Convert Blob → ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();
    // 2. Convert ArrayBuffer → Base64
    const buffer = Buffer.from(arrayBuffer);
    const base64ImageFile = buffer.toString("base64");

    return base64ImageFile;
}


export const extractInformation = internalAction({
    args: {
        front_image: v.id("_storage"),
        back_image: v.id("_storage"),
    },
    handler: async (ctx, { front_image, back_image }) => {

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const front_blob = await ctx.storage.get(front_image);

        const base64FrontImage = await base64Converter(front_blob);

        const back_blob = await ctx.storage.get(back_image)

        const base64BackImage = await base64Converter(back_blob);

        const contents = [

            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64FrontImage,
                },
            },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64BackImage
                }
            },
            {
                text: `
You are an expert in extracting identity document information.

Extract the following fields from this document. 
Return ONLY valid JSON matching the schema:

{
  first_name: string,
  last_name: string,
  dob: string (YYYY-MM-DD),
  gender: string,
  nationality: string,
  issuing_state: string,
  address: string,
  document_number: string,
  document_type: string
}

If a value is missing, return an empty string.
No extra fields. No explanation.
        `,
            },

        ];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: zodToJsonSchema(kycExtractSchema),
            },
        });

        const kycdetails = kycExtractSchema.parse(JSON.parse(response.text || ''));

        console.log("kycDetails", kycdetails);


        return kycdetails
    }
})

export const extractPersonGender = internalAction({
    args: {
        person_image: v.id("_storage"),
    },
    handler: async (ctx, { person_image }) => {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const blob = await ctx.storage.get(person_image);
        const base64 = await base64Converter(blob);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64,
                },
            }, {
                text: `
                Extract only gender from the image.
                Return JSON: { gender: string }
                No explanation.
        `,
            }],
            config: {
                responseMimeType: "application/json",
                responseJsonSchema: zodToJsonSchema(genderSchema),
            },
        });

        const genderDetails = genderSchema.parse(JSON.parse(response.text || ''));
        return genderDetails
    }
});






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


