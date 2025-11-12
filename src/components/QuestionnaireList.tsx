import { useMutation } from "convex/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Button } from "./ui/button";

export default function QuestionnaireList() {
    // ✅ Suspense query instead of useQuery
    const { data: questionnaires } = useSuspenseQuery(
        convexQuery(api.questionnaires.list, {})
    );

    const deleteQuestionnaire = useMutation(api.questionnaires.remove);

    if (questionnaires.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <p>No questionnaires yet.</p>
                <Button

                    className="mt-3 bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                >
                    + Create one
                </Button>
            </div>
        );
    }

    return (
        <ul className="grid gap-3">
            {questionnaires.map((q) => (
                <li
                    key={q._id}
                    className="border rounded-lg p-4 bg-white hover:shadow-sm transition"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg font-semibold">{q.title}</h2>
                            {q.description && (
                                <p className="text-sm text-gray-600">{q.description}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                                Created on {new Date(q.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Link
                                to="/questionnaires/$id"
                                params={{ id: q._id }}
                                className="text-blue-600 text-sm hover:underline"
                            >
                                Edit →
                            </Link>

                            <Button
                                intent="danger"
                                onClick={() => deleteQuestionnaire({ id: q._id })}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}
