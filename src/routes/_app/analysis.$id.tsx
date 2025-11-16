/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'

export const Route = createFileRoute('/_app/analysis/$id')({
    component: AnalysisDetail,
})

function Section({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide">{title}</h2>
            <div className="text-xs text-neutral-800 space-y-1">{children}</div>
        </section>
    )
}

export default function AnalysisDetail() {
    const { id } = Route.useParams()
    const result = useQuery(api.helpers.getScrapeResultById, {
        id: id as Id<'siteAnalysis'>,
    })

    if (!result) {
        return (
            <main className="min-h-screen bg-white text-black font-mono">
                <div className="max-w-4xl mx-auto px-4 py-10 text-neutral-500 text-sm uppercase">
                    Loading...
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-white text-black font-mono">
            <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
                <h1 className="text-3xl font-semibold uppercase">AML Analysis</h1>

                <article className="border border-neutral-200 rounded-lg bg-white overflow-hidden">
                    {/* Header */}
                    <header className="border-b border-neutral-200 px-5 py-4 space-y-1">
                        <h3 className="text-sm font-semibold uppercase tracking-wide break-all">
                            {result.siteUrl}
                        </h3>
                        <p className="text-[10px] text-neutral-500 uppercase">
                            Analyzed {new Date(result._creationTime).toLocaleString()}
                        </p>
                        <p className="text-[10px] text-neutral-700 uppercase">
                            Status: {result.status}
                        </p>
                    </header>

                    <div className="px-5 py-4 space-y-8">
                        {/* 1. Company Info */}
                        <Section title="Company Information">
                            <div>Name: {result.companyName}</div>
                            <div>Incorporation Number: {result.incorporationNumber}</div>
                            <div>Jurisdiction: {result.jurisdiction}</div>

                            <div>Registered Address: {result.registeredAddress}</div>

                            <div>
                                Operational Addresses:
                                <ul className="ml-4 list-disc">
                                    {result.operationalAddresses.map((addr, i) => (
                                        <li key={i}>{addr}</li>
                                    ))}
                                </ul>
                            </div>
                        </Section>

                        {/* 2. Contact Details */}
                        <Section title="Contact Details">
                            <div>
                                Emails:
                                <ul className="ml-4 list-disc">
                                    {result.emails.map((e, i) => (
                                        <li key={i}>{e}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                Phones:
                                <ul className="ml-4 list-disc">
                                    {result.phones.map((p, i) => (
                                        <li key={i}>{p}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                Websites:
                                <ul className="ml-4 list-disc">
                                    {result.websites.map((w, i) => (
                                        <li key={i}>{w}</li>
                                    ))}
                                </ul>
                            </div>
                        </Section>

                        {/* 3. Directors */}
                        <Section title="Directors & Roles">
                            <ul className="ml-4 list-disc">
                                {result.directors.map((d, i) => (
                                    <li key={i}>
                                        {d.name || 'Unknown'} — {d.role || 'Unknown'}
                                    </li>
                                ))}
                            </ul>
                        </Section>

                        {/* 4. Business Activities */}
                        <Section title="Business Activities">
                            <ul className="ml-4 list-disc">
                                {result.businessActivities.map((b, i) => (
                                    <li key={i}>{b}</li>
                                ))}
                            </ul>
                        </Section>

                        {/* 5. Payment Methods */}
                        <Section title="Payment Methods">
                            <ul className="ml-4 list-disc">
                                {result.paymentMethods.map((pm, i) => (
                                    <li key={i}>{pm}</li>
                                ))}
                            </ul>
                        </Section>

                        {/* 6. Ownership */}
                        <Section title="Ownership">
                            {result.ownership}
                        </Section>

                        {/* 7. Registration Dates */}
                        <Section title="Registration Dates">
                            <div>
                                Incorporation Date:{' '}
                                {result.registrationDates.incorporationDate}
                            </div>
                        </Section>

                        {/* 8. Policy Texts */}
                        <Section title="Privacy Policy">
                            <pre className="whitespace-pre-wrap text-[10px]">
                                {result.privacyPolicyText}
                            </pre>
                        </Section>

                        <Section title="Terms & Conditions">
                            <pre className="whitespace-pre-wrap text-[10px]">
                                {result.termsText}
                            </pre>
                        </Section>

                        {/* 9. Social Links */}
                        <Section title="Social Links">
                            <ul className="ml-4 list-disc">
                                {result.socialLinks.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </Section>
                        <Section title="AML Risk Assessment">
                            <div>Score: {result.amlRiskScore}</div>
                            <div>Category: {result.amlRiskCategory}</div>
                            <div>State: {result.amlRecommendedState}</div>
                            <div className="pt-2">
                                Notes:
                                <pre className="whitespace-pre-wrap text-[10px]">
                                    {result.amlNotes}
                                </pre>
                            </div>
                        </Section>

                        {/* 12. Issues */}
                        <Section title="Detected Issues">
                            {result.detectedIssues.map((iss, i) => (
                                <div key={i} className="border p-2 rounded">
                                    <div className="font-semibold">{iss.issue}</div>
                                    <div>Confidence: {iss.confidence}</div>
                                    <pre className="text-[10px] whitespace-pre-wrap">
                                        {iss.evidence}
                                    </pre>
                                </div>
                            ))}
                        </Section>

                        {/* 13. Next Steps */}
                        <Section title="Suggested Next Steps">
                            <ul className="ml-4 list-disc">
                                {result.suggestedNextSteps.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </Section>

                    </div>
                </article>
            </div>
        </main>
    )
}
