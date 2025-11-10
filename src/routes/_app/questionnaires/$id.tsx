import { createFileRoute, } from "@tanstack/react-router";
import { useSuspenseQuery } from '@tanstack/react-query'

import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { Suspense } from "react";
import type { Id } from "convex/_generated/dataModel";
import QuestionnaireBuilder from "~/components/QuestionnaireBuilder";

export const Route = createFileRoute("/_app/questionnaires/$id")({
    // ✅ Prefetch both queries before rendering
    loader: async ({ context: { queryClient }, params }) => {
        const { id } = params;

        // Ensure both questionnaire + questions data is prefetched
        await Promise.all([
            queryClient.ensureQueryData(
                convexQuery(api.questionnaires.get, { id: id as Id<"questionnaires"> })
            ),
            queryClient.ensureQueryData(
                convexQuery(api.questions.listByQuestionnaire, { questionnaireId: id as Id<"questionnaires"> })
            ),
        ]);
    },

    // ✅ Show fallback while data is loading
    pendingComponent: () => (
        <div className="p-6 text-gray-500 animate-pulse">Loading questionnaire...</div>
    ),

    component: RouteComponent,
});

function RouteComponent() {
    const { id } = Route.useParams();

    const { data: questionnaire } = useSuspenseQuery(
        convexQuery(api.questionnaires.get, { id })
    );
    const { data: questions } = useSuspenseQuery(
        convexQuery(api.questions.listByQuestionnaire, { questionnaireId: id })
    );

    const initialData = { ...questionnaire, questions };

    return (
        <Suspense fallback={<QuestionnaireSkeleton />}>
            <div className="container space-y-4">
                <h1 className="text-xl font-bold">Edit Questionnaire</h1>
                <QuestionnaireBuilder initialData={initialData} />
            </div>
        </Suspense>
    );
}

function QuestionnaireSkeleton() {
    return (
        <div className="animate-pulse space-y-4 p-6">
            <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
            <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
            </div>
        </div>
    );
}
