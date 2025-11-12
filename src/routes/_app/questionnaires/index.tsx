import { createFileRoute, } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { Suspense } from "react";
import QuestionnaireList from "~/components/QuestionnaireList";

// TODO: Remove the New Link and instead use the dialog form pattern

export const Route = createFileRoute("/_app/questionnaires/")({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(
      convexQuery(api.questionnaires.list, {})
    );
  },

  pendingComponent: () => (
    <div className="p-6 text-gray-500 animate-pulse">Loading questionnaires...</div>
  ),

  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Suspense fallback={<QuestionnaireListSkeleton />}>
      <div className="container mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Questionnaires</h1>
          <button
            // to="/questionnaires/new"
            className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
          >
            + Create
          </button>
        </div>

        <QuestionnaireList />
      </div>
    </Suspense>
  );
}

function QuestionnaireListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="border rounded-lg p-4 bg-gray-100 h-20 flex items-center justify-between"
        >
          <div className="space-y-2 w-3/4">
            <div className="h-4 bg-gray-300 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
          <div className="h-8 w-16 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}
