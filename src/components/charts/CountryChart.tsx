/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import { useMemo } from "react"
import type { Doc } from "convex/_generated/dataModel"
import { BarList } from "~/components/ui/bar-list"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

export function NewsChart({ sessions }: { sessions: Array<Doc<"sessions">> }) {

    const chartData = useMemo(() => {
        if (!sessions || sessions.length === 0) return []

        const counts: Record<string, number> = {}

        for (const session of sessions) {
            const results = session.news_results ?? []

            for (const item of results) {
                try {
                    const url = item.url
                    if (!url) continue

                    const domain = new URL(url).hostname.replace("www.", "")
                    counts[domain] = (counts[domain] || 0) + 1
                } catch {
                    // ignore malformed URLs
                }
            }
        }

        return Object.entries(counts).map(([domain, count]) => ({
            name: domain,
            value: count,
        }))
    }, [sessions])

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>News Mentions by Source</CardTitle>
                <CardDescription>Based on URLs found in news_results.</CardDescription>
            </CardHeader>

            <CardContent>
                <BarList
                    data={chartData}
                    valueFormatter={(value) => `${value} mentions`}
                />
            </CardContent>
        </Card>
    )
}
