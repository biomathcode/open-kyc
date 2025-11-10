import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { QuestionItem } from "./QuestionItem";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function QuestionnaireBuilder({ initialData }: { initialData?: any }) {
    const createQuestionnaire = useMutation(api.questionnaires.create);
    const updateQuestionnaire = useMutation(api.questionnaires.update);
    const addQuestion = useMutation(api.questions.add);
    const updateQuestion = useMutation(api.questions.update);
    // Optional deleteQuestion mutation can be added too

    const [saving, setSaving] = useState(false);

    const [questionnaire, setQuestionnaire] = useState(() => ({
        id: initialData?._id || null,
        title: initialData?.title || "",
        description: initialData?.description || "",
    }));

    const [questions, setQuestions] = useState<any[]>(() => initialData?.questions || []);

    useEffect(() => {
        if (initialData) {
            setQuestionnaire({
                id: initialData._id,
                title: initialData.title,
                description: initialData.description,
            });
            setQuestions(initialData.questions || []);
        }
    }, [initialData]);

    const handleSaveQuestionnaire = async () => {
        if (!questionnaire.title.trim()) {
            toast.error("Title is required");
            return;
        }

        try {
            setSaving(true);
            if (questionnaire.id) {
                await updateQuestionnaire({
                    id: questionnaire.id,
                    title: questionnaire.title,
                    description: questionnaire.description,
                });
                toast.success("Questionnaire updated");
            } else {
                const id = await createQuestionnaire({
                    title: questionnaire.title,
                    description: questionnaire.description,
                });
                setQuestionnaire((prev) => ({ ...prev, id }));
                toast.success("Questionnaire created");
            }
        } catch (err) {
            toast.error("Something went wrong while saving");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const handleAddQuestion = async () => {
        if (!questionnaire.id) {
            toast.warning("Create the questionnaire first");
            return;
        }

        const newQuestion = {
            id: crypto.randomUUID(),
            text: "Untitled Question",
            required: false,
            order: questions.length,
        };

        setQuestions((prev) => [...prev, newQuestion]);

        try {
            const savedId = await addQuestion({
                questionnaireId: questionnaire.id,
                text: newQuestion.text,
                required: newQuestion.required,
                order: newQuestion.order,
            });
            setQuestions((prev) =>
                prev.map((q) =>
                    q.id === newQuestion.id ? { ...q, _id: savedId } : q
                )
            );
            toast.success("Question added");
        } catch (err) {
            toast.error("Failed to add question");
            console.error(err);
        }
    };

    const handleChangeQuestion = async (updated: any) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === updated.id ? updated : q))
        );

        if (!updated._id) return; // Skip unsaved questions

        try {
            await updateQuestion({
                id: updated._id,
                text: updated.text,
                required: updated.required,
            });
            toast.message("Question saved", {
                description: "Your edits were saved successfully",
            });
        } catch (err) {
            toast.error("Failed to update question");
            console.error(err);
        }
    };

    const handleDeleteQuestion = (id: string) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
        toast.info("Question removed");
        // Optionally call deleteQuestion mutation
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-5 border space-y-3">
                <Input
                    placeholder="Untitled Questionnaire"
                    value={questionnaire.title}
                    onChange={(e) =>
                        setQuestionnaire({ ...questionnaire, title: e.target.value })
                    }
                />
                <Textarea
                    className="w-full border rounded-md p-2 text-sm resize-none focus:ring-1 focus:ring-blue-400 outline-none"
                    placeholder="Description..."
                    rows={3}
                    value={questionnaire.description}
                    onChange={(e) =>
                        setQuestionnaire({ ...questionnaire, description: e.target.value })
                    }
                />
                <div className="flex justify-end">
                    <Button
                        isDisabled={saving}
                        className={`px-4 py-2 text-sm rounded-md font-medium text-white ${saving
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            } transition`}
                        onClick={handleSaveQuestionnaire}
                    >
                        {saving
                            ? "Saving..."
                            : questionnaire.id
                                ? "Save Changes"
                                : "Create Questionnaire"}
                    </Button>
                </div>
            </div>

            <div className="space-y-3">
                <h2 className="font-semibold text-neutral-500 text-lg">Questions</h2>

                <div className="space-y-4">
                    {questions.map((q) => (
                        <QuestionItem
                            key={q.id}
                            question={q}
                            onChange={handleChangeQuestion}
                            onDelete={handleDeleteQuestion}
                        />
                    ))}
                </div>

                <Button
                    onClick={handleAddQuestion}
                    className="flex items-center gap-2   border rounded-md px-3 py-2 text-sm transition"
                >
                    + Add Question
                </Button>
            </div>
        </div>
    );
}
