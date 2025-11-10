import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

export function QuestionItem({ question, onChange, onDelete }: any) {
    const [text, setText] = useState(question.text);
    const [required, setRequired] = useState(question.required);

    const handleBlur = () => {
        if (text.trim() !== question.text || required !== question.required) {
            onChange({ ...question, text, required });
            toast.success("Question updated");
        }
    };

    const handleRequiredChange = (isSelected: boolean) => {
        setRequired(isSelected);
        onChange({ ...question, text, required: isSelected });
        toast.message("Required updated", {
            description: isSelected
                ? "Question marked as required"
                : "Question made optional",
        });
    };

    return (
        <div className="border rounded-lg p-4 bg-white shadow-sm flex flex-col gap-3 hover:shadow-md transition">
            <div className="flex items-center gap-3">
                <Input
                    className="flex-1 border-b outline-none text-base font-medium focus:border-blue-500 transition"
                    placeholder="Enter your question..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onBlur={handleBlur}
                />
                <Button
                    onClick={() => {
                        onDelete(question.id);
                        toast.info("Question deleted");
                    }}
                    size="sm"
                    intent="danger"
                >
                    <Trash2 size={14} />
                </Button>
            </div>

            <Checkbox
                isSelected={required}
                onChange={handleRequiredChange}
                value="required"
            >
                Required
            </Checkbox>
        </div>
    );
}
