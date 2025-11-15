"use client"

import { InfoIcon } from "lucide-react"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "convex/react"
import { api } from "convex/_generated/api"
import { country } from "./index"
import type { AnyFieldApi } from "@tanstack/react-form";
import type { flowStates } from "./index"

import type { Key } from "react-aria-components"
import type { Id } from "convex/_generated/dataModel"
import { Button } from "~/components/ui/button"
import { Radio, RadioGroup } from "~/components/ui/radio"
import { Select, SelectContent, SelectItem, SelectTrigger } from "~/components/ui/select"
import { Label } from "~/components/ui/field"




function FieldInfo({ field }: { field: AnyFieldApi }) {
    return (
        <div className="text-red-500 text-xs mt-1">
            {field.state.meta.isTouched && !field.state.meta.isValid
                ? field.state.meta.errors.join(", ")
                : null}
        </div>
    )
}


export const DocumentStep = ({
    setFlow,
    sessionId,
}: {
    setFlow: (flow: flowStates) => void
    sessionId: Id<"sessions">
}) => {
    const updateSession = useMutation(api.sessions.updateSession)

    const form = useForm({
        defaultValues: {
            document_type: "",
            nationality: "",
        },

        onSubmit: async ({ value }) => {
            await updateSession({
                sessionId,
                updates: {
                    document_type: value.document_type,
                    nationality: value.nationality,
                },
            })

            setFlow("camera")
        },
    })

    return (
        <div className="relative flex-1">
            <div className="h-full">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className="wrapper h-full flex grow flex-col rounded-t-pnl-xl bg-transparent p-6 pt-3 md:pt-4"
                >
                    <div className="mx-auto flex size-full max-w-md flex-col items-center">

                        {/* SCROLL */}
                        <div className="scrollbar-none max-h-full w-full flex-1 overflow-scroll">

                            {/* Heading */}
                            <div className="mx-auto mb-6 w-full sm:max-w-[440px]">
                                <h4 className="text-2xl font-medium text-start mb-2 leading-[110%] tracking-[-1.2px]">
                                    Choose Verification Document
                                </h4>
                                <p className="text-[14px] leading-[140%] tracking-[-0.78px] text-bc-secondary">
                                    Please select a document to verify your identity.
                                </p>
                            </div>

                            {/* Document Type */}
                            <form.Field
                                name="document_type"
                                validators={{
                                    onChange: ({ value }) =>
                                        !value ? "Document type is required" : undefined,
                                }}
                            >
                                {(field) => (
                                    <div>
                                        <RadioGroup
                                            value={field.state.value}
                                            onChange={(val) => field.handleChange(val)}
                                        >
                                            <Radio value="national_id"><Label>National ID card</Label></Radio>
                                            <Radio value="passport"><Label>Passport</Label></Radio>
                                            <Radio value="driver_license"><Label>Driver's license</Label></Radio>
                                            <Radio value="residence_permit"><Label>Residence permit</Label></Radio>
                                        </RadioGroup>

                                        <FieldInfo field={field} />
                                    </div>
                                )}
                            </form.Field>

                            {/* Country */}
                            <div className="py-6">
                                <Label className="font-semibold">Country of origin:</Label>

                                <form.Field
                                    name="nationality"
                                    validators={{
                                        onChange: ({ value }) =>
                                            !value ? "Please select your nationality" : undefined,
                                    }}
                                >
                                    {(field) => (
                                        <div>
                                            <Select
                                                value={field.state.value}
                                                onChange={(val: Key | null) => field.handleChange(val ? String(val) : "")}
                                                placeholder="Select Country"
                                            >
                                                <SelectTrigger />
                                                <SelectContent items={country}>
                                                    {(item) => (
                                                        <SelectItem id={item.iso_code} textValue={item.country}>
                                                            {item.country}
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>

                                            <FieldInfo field={field} />
                                        </div>
                                    )}
                                </form.Field>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-3 pt-1 md:pt-6">
                            <div className="mx-auto flex max-w-96 items-center gap-2 w-fit">
                                <InfoIcon />
                                <p className="text-left text-[12px] font-medium">
                                    Your information is only used for identity verification
                                </p>
                            </div>

                            <form.Subscribe
                                selector={(state) => [state.canSubmit, state.isSubmitting]}
                            >
                                {([canSubmit, isSubmitting]) => (
                                    <Button
                                        intent="primary"
                                        isDisabled={!canSubmit}
                                        className="w-full"
                                        type="submit"
                                    >
                                        {isSubmitting ? "..." : "Continue"}
                                    </Button>
                                )}
                            </form.Subscribe>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
