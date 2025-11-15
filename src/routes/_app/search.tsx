import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAction } from "convex/react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { api } from "convex/_generated/api";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const Route = createFileRoute("/_app/search")({
    component: SearchPage,
});

export interface WebResult {
    url: string;
    title: string;
    description: string;
    position: number;
}


interface SearchResults {
    web?: Array<WebResult>;
    news?: Array<any>;
    images?: Array<any>;
}

const searchSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
});



function SearchPage() {
    const [results, setResults] = useState<SearchResults | null>(null);

    const searchMutation = useAction(api.search.publicSearch);

    const form = useForm({
        defaultValues: {
            name: "",
        },
        onSubmit: async ({ value }) => {
            const res = await searchMutation({ name: value.name });
            setResults(res);
        },
    });

    const web = results?.web ?? [];
    const news = results?.news ?? [];
    const images = results?.images ?? [];


    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <Card className="">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Background Check Search</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            form.handleSubmit()
                        }}
                        className="space-y-4"
                    >
                        <form.Field
                            name="name"
                            validators={{
                                onChange: ({ value }) => {
                                    const r = searchSchema.shape.name.safeParse(value);
                                    if (!r.success) return r.error.issues[0]?.message;
                                },
                            }}
                        >
                            {(field) => (
                                <div className="space-y-1">
                                    <Input
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder="Enter full name to search"
                                    />

                                    {field.state.meta.errors.map((err) => (
                                        <p key={err as string} className="text-red-500 text-sm">
                                            {err}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </form.Field>
                        <form.Subscribe
                            selector={(s) => [s.canSubmit, s.isSubmitting]}
                        >
                            {([canSubmit, isSubmitting]) => (
                                <Button
                                    type="submit"
                                    intent="primary"
                                    isDisabled={!canSubmit || isSubmitting}
                                    className="w-full"
                                >
                                    {isSubmitting ? "Searching..." : "Search"}
                                </Button>
                            )}
                        </form.Subscribe>
                    </form>
                </CardContent>
            </Card>

            {results && (
                <div className="space-y-6">
                    {/* Web Results */}
                    {web.length > 0 && (
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-medium">Web Results</h3>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {web.map((item) => (
                                    <div key={item.url} className="border-b pb-3">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold hover:underline"
                                        >
                                            {item.title}
                                        </a>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* News */}
                    {news.length > 0 && (
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-medium">News</h3>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {news.map((item) => (
                                    <div key={item.url} className="border-b pb-3">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-semibold hover:underline"
                                        >
                                            {item.title}
                                        </a>
                                        <p className="text-sm text-muted-foreground">{item.snippet}</p>
                                        <span className="text-xs text-muted-foreground">{item.date}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}

                    {/* Images */}
                    {images.length > 0 && (
                        <Card>
                            <CardHeader>
                                <h3 className="text-lg font-medium">Images</h3>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                {images.map((item) => (
                                    <a
                                        key={item.url}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="rounded w-full"
                                        />
                                        <p className="text-sm mt-1 truncate">{item.title}</p>
                                    </a>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

        </div >
    );
}
