/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { useMemo } from "react";
import type { Doc } from "convex/_generated/dataModel"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { PieChart } from "~/components/ui/pie-chart"

export function TrafficChart({ sessions }: { sessions: Array<Doc<"sessions">> }) {
    const data = useMemo(() => {
        if (!sessions || sessions.length === 0) return []

        // FIX: Give a proper type
        const statusCounts: Record<string, number> = {}

        for (const s of sessions) {
            const st = s.status || "unknown"
            statusCounts[st] = (statusCounts[st] || 0) + 1
        }

        return Object.entries(statusCounts).map(([status, count]) => ({
            name: status,
            amount: count,
        }))
    }, [sessions])

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <CardTitle>Session Status Breakdown</CardTitle>
                <CardDescription>Status distribution across all verification sessions.</CardDescription>
            </CardHeader>

            <CardContent>
                <PieChart
                    className="mx-auto h-56"
                    data={data}
                    dataKey="amount"
                    nameKey="name"
                    config={
                        Object.fromEntries(
                            data.map((d) => [
                                d.name,
                                { label: d.name.charAt(0).toUpperCase() + d.name.slice(1) }
                            ])
                        )
                    }
                />
            </CardContent>
        </Card>
    )
}
