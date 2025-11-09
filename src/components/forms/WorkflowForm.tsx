"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { v4 as uuid } from "uuid";

import { Form } from "react-aria-components";
import { api } from "convex/_generated/api";
import {
    Button,
} from "~/components/ui/button";
import {
    Description,
    FieldError,
    Fieldset,
    Label,
    Legend,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { TextField } from "~/components/ui/text-field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "~/components/ui/select";

const STEP_TYPES = [
    { id: "id_verification", name: "ID Verification" },
    { id: "face_match", name: "Face Match" },
    { id: "ip_analysis", name: "IP Analysis" },
    { id: "address_check", name: "Address Check" },
    { id: "document_validation", name: "Document Validation" },
] as const;

const STATUS_OPTIONS = [
    { id: "active", name: "Active" },
    { id: "pending", name: "Pending" },
    { id: "archived", name: "Archived" },
] as const;

export function WorkflowForm() {
    const createWorkflow = useMutation(api.functions.workflows.createWorkflow);

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            type: "",
            status: "pending" as "active" | "pending" | "archived",
            steps: [] as Array<{
                id: string;
                label: string;
                enabled: boolean;
                type: "id_verification" | "face_match" | "ip_analysis" | "address_check" | "document_validation";
            }>,
        },
        onSubmit: async ({ value }) => {
            await createWorkflow(value);
            alert("Workflow created successfully!");
            form.reset();
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
                <Legend>Create Workflow</Legend>
                <Text>Define the verification workflow details below.</Text>

                {/* Name */}
                <form.Field name="name">
                    {(field) => (
                        <TextField isRequired name={field.name}>
                            <Label>Name</Label>
                            <Input
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="e.g. KYC Verification"
                            />
                            <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                            <Description>Workflow display name.</Description>
                        </TextField>
                    )}
                </form.Field>

                {/* Description */}
                <form.Field name="description">
                    {(field) => (
                        <TextField name={field.name}>
                            <Label>Description</Label>
                            <Input
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Brief description..."
                            />
                        </TextField>
                    )}
                </form.Field>

                {/* Type */}
                <form.Field name="type">
                    {(field) => (
                        <TextField name={field.name}>
                            <Label>Type</Label>
                            <Input
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="e.g. onboarding"
                            />
                            <Description>Category of workflow (like KYC, onboarding)</Description>
                        </TextField>
                    )}
                </form.Field>

                {/* Status */}
                <form.Field name="status">
                    {(field) => (
                        <>
                            <Label>Status</Label>
                            <Select
                                aria-label="Status"
                                placeholder="Select status"
                                selectedKey={field.state.value}
                                onSelectionChange={(key) => field.handleChange(key as "active" | "pending" | "archived")}
                            >
                                <SelectTrigger />
                                <SelectContent items={STATUS_OPTIONS}>
                                    {(item) => (
                                        <SelectItem id={item.id} textValue={item.name}>
                                            {item.name}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </>
                    )}
                </form.Field>

                {/* Steps section */}
                <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Steps</Label>
                        <Button
                            type="button"
                            onPress={() =>
                                form.setFieldValue("steps", [
                                    ...form.state.values.steps,
                                    {
                                        id: uuid(),
                                        label: "",
                                        enabled: true,
                                        type: "id_verification",
                                    },
                                ])
                            }
                        >
                            + Add Step
                        </Button>
                    </div>

                    {form.state.values.steps.map((step, index) => (
                        <div
                            key={step.id}
                            className="flex items-center gap-3 border p-3 rounded-lg"
                        >
                            {/* Label input */}
                            <Input
                                value={step.label}
                                onChange={(e) => {
                                    const newSteps = [...form.state.values.steps];
                                    newSteps[index].label = e.target.value;
                                    form.setFieldValue("steps", newSteps);
                                }}
                                placeholder="Step label"
                            />

                            {/* Step type select */}
                            <Select
                                aria-label="Step type"
                                placeholder="Select type"
                                selectedKey={step.type}
                                onSelectionChange={(key) => {
                                    const newSteps = [...form.state.values.steps];
                                    newSteps[index].type = key as typeof STEP_TYPES[number]["id"];
                                    form.setFieldValue("steps", newSteps);
                                }}
                            >
                                <SelectTrigger />
                                <SelectContent items={STEP_TYPES}>
                                    {(item) => (
                                        <SelectItem id={item.id} textValue={item.name}>
                                            {item.name}
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>

                            {/* Remove button */}
                            <Button
                                type="button"
                                onPress={() => {
                                    const newSteps = form.state.values.steps.filter(
                                        (_, i) => i !== index
                                    );
                                    form.setFieldValue("steps", newSteps);
                                }}
                            >
                                🗑
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-6" data-slot="control">
                    <Button type="submit" isDisabled={form.state.isSubmitting}>
                        {form.state.isSubmitting ? "Creating..." : "Create Workflow"}
                    </Button>
                </div>
            </Fieldset>
        </Form>
    );
}
