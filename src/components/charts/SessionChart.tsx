
import { format } from "date-fns"
import { useMemo } from "react"
import type { Doc } from "convex/_generated/dataModel"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { LineChart } from "~/components/ui/line-chart"


export function SessionChart({ sessions }: { sessions: Array<Doc<"sessions">> }) {
    const chartData = useMemo(() => {
        // Build last 7 days structure
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i)) // oldest → newest
            const key = format(date, "yyyy-MM-dd")

            return {
                day: format(date, "MMM d"),
                key,
                sessions: 0,
            }
        })

        // Count sessions by date
        sessions.forEach((s) => {
            const created = format(new Date(s.createdAt), "yyyy-MM-dd")
            const match = last7Days.find((d) => d.key === created)
            if (match) match.sessions += 1
        })

        return last7Days
    }, [sessions])

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Session Opened last 7d</CardTitle>
                <CardDescription>
                    Tracks likes, comments, and shares during the most recent 7-day period.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LineChart
                    className="aspect-video h-56 min-h-[224px] sm:h-72 sm:min-h-[288px]"
                    data={chartData}
                    dataKey="day"
                    xAxisProps={{ interval: 0 }}
                    config={{
                        sessions: { label: "Sessions" },
                    }}
                />
            </CardContent>
        </Card>
    )
}
