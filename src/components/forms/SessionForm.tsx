
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { Form } from "react-aria-components";
import { useState } from "react";

import { toast } from "sonner"; // optional if you use sonner for toasts
import { Button } from "~/components/ui/button";
import {
    Description,
    FieldError,
    Fieldset,
    Label,
    Legend,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { TextField } from "~/components/ui/text-field";

export function SessionForm() {
    const createSession = useMutation(api.sessions.createSession);
    const workflows = useQuery(api.functions.workflows.getWorkflows, {});
    const [sessionLink, setSessionLink] = useState<string | null>(null);

    const form = useForm({
        defaultValues: {
            workflowId: "",
            username: "",
            email: "",
        },
        onSubmit: async ({ value }) => {
            try {
                const { sessionId } = await createSession({
                    workflowId: value.workflowId as any, // Convex expects Id<"workflows">
                    username: value.username || undefined,
                    email: value.email || undefined,
                });
                const link = `${window.location.origin}/sessions/${sessionId}`;
                setSessionLink(link);
                toast.success("Session created successfully!");
                form.reset();
            } catch (err) {
                console.error(err);
                toast.error("Failed to create session");
            }
        },
    });

    return (
        <Form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <Fieldset>
                <Legend>Create Verification Session</Legend>
                <Text>
                    Select a workflow and generate a new session link for a user to
                    complete their verification.
                </Text>

                {/* Workflow Selection */}
                <form.Field name="workflowId">
                    {(field) => (
                        <>
                            <Label>Workflow</Label>
                            <Select
                                aria-label="Workflow"
                                placeholder="Select workflow"
                                selectedKey={field.state.value}
                                onSelectionChange={(key) => field.handleChange(key as string)}
                            >
                                <SelectTrigger />
                                <SelectContent
                                    items={workflows || []}
                                    className="max-h-60 overflow-y-auto"
                                >
                                    {(wf) => (
                                        <SelectItem
                                            id={wf._id}
                                            textValue={wf.name}
                                        >
                                            {wf.name} — <span className="text-xs">{wf.status}</span>
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                            <Description>Select the workflow type (like KYC, onboarding, etc).</Description>
                        </>
                    )}
                </form.Field>

                {/* Username */}
                <form.Field name="username">
                    {(field) => (
                        <TextField name={field.name}>
                            <Label>Username</Label>
                            <Input
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="e.g. John Doe"
                            />
                        </TextField>
                    )}
                </form.Field>

                {/* Email */}
                <form.Field name="email">
                    {(field) => (
                        <TextField name={field.name}>
                            <Label>Email</Label>
                            <Input
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="e.g. john@example.com"
                            />
                            <Description>Optional — helps identify the user later.</Description>
                        </TextField>
                    )}
                </form.Field>

                <div className="mt-6" data-slot="control">
                    <Button
                        type="submit"
                        isDisabled={form.state.isSubmitting || workflows?.length === 0}
                    >
                        {form.state.isSubmitting ? "Creating..." : "Create Session"}
                    </Button>
                </div>

                {sessionLink && (
                    <div className="mt-6 p-3 bg-muted rounded-lg">
                        <Label>Session Link</Label>
                        <p className="break-all text-sm mt-1">{sessionLink}</p>
                        <Button
                            type="button"
                            intent="outline"
                            size="sm"
                            className="mt-2"
                            onPress={() => navigator.clipboard.writeText(sessionLink)}
                        >
                            Copy Link
                        </Button>
                    </div>
                )}
            </Fieldset>
        </Form>
    );
}
