import { ArrowBigLeft, InfoIcon } from "lucide-react"

import { country } from "./index";
import type { flowStates } from "./index"


import { Button } from '~/components/ui/button';
import { Radio, RadioGroup } from '~/components/ui/radio';
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from '~/components/ui/select';
import { Label } from '~/components/ui/field';


export const DocumentStep = ({ setFlow }: { setFlow: (flow: flowStates) => void }) => {

    // documnet selection -> type of id select, country select


    return (
        <div className="flex flex-col gap-2 w-full px-2 py-2">


            <div className="relative flex-1">
                <div className="h-full">
                    <div className="wrapper h-full flex grow flex-col rounded-t-pnl-xl bg-transparent p-6 pt-3 text-center md:pt-4 [@media(max-height:670px)]:p-4 [@media(max-height:670px)]:pt-2 [@media(max-height:670px)]:rounded-t-pnl-l">
                        <div className='mx-auto flex size-full max-w-md flex-col items-center'>
                            <div className="scrollbar-none max-h-full w-full flex-1 overflow-scroll">
                                <div className="mx-auto mb-6 w-full sm:max-w-[440px] [@media(max-height:700px)]:mb-3">
                                    <h4 className="text-2xl font-medium text-start mb-2 leading-[110%] tracking-[-1.2px] font-bc-font text-bc-primary [@media(max-height:700px)]:text-xl [@media(max-width:390px)]:text-xl [@media(max-height:700px)]:mb-1.5 [@media(max-width:390px)]:mb-1.5 [@media(max-height:600px)]:mb-1 [@media(max-width:350px)]:mb-1">
                                        Choose Verification Document
                                    </h4>
                                    <p className="text-[14px] leading-[140%] tracking-[-0.78px] text-bc-secondary">
                                        Please select a document to verify your identity.
                                    </p>
                                </div>
                                <RadioGroup name="billing">
                                    {/* <Label>Billing Cycle</Label>
                                    <Description>Select how often you'd like to be billed</Description> */}

                                    <Radio value="national_id"
                                        className="text-start"
                                    >
                                        <Label>National ID card</Label>
                                        {/* <Description>Billed every month</Description> */}
                                    </Radio>
                                    <Radio value="passport"
                                        className="text-start"
                                    >
                                        <Label>Passport</Label>
                                        {/* <Description>Billed every 3 months</Description> */}
                                    </Radio>
                                    <Radio value="driver_license"

                                        className="text-start"
                                    >
                                        <Label>Driver's license</Label>
                                        {/* <Description>Billed once per year with a discount</Description> */}
                                    </Radio>
                                    <Radio value="residence_permit"
                                        className="text-start"
                                    >
                                        <Label>Residence permit</Label>
                                        {/* <Description>Billed once per year with a discount</Description> */}
                                    </Radio>

                                </RadioGroup>
                            </div>
                            <div className="py-8 [@media(max-height:700px)]:pt-3 cursor-pointer w-full ">
                                <div className='text-start flex flex-col gap-2'>
                                    <Label className="font-semibold">
                                        Country of origin:
                                    </Label>


                                    <Select className="w-full" aria-label="country" placeholder="Select Country of origin">
                                        <SelectTrigger />
                                        <SelectContent items={country}>
                                            {(item) => (
                                                <SelectItem id={item.id} textValue={item.name}>
                                                    {item.name}
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>


                            </div>
                        </div>
                        <div className="pb-1">
                            <div className="
          absolute left-0 w-screen border-t border-bc-surface-2/20
        "
                            >
                            </div>
                        </div>
                        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-3 pt-1 md:pt-6">
                            <div className="mx-auto flex max-w-96 items-center gap-2 w-fit">
                                <InfoIcon />
                                <p className='text-left font-bc-font text-[12px] font-medium tracking-tighter text-bc-surface-1 [@media(max-width:360px)]:text-[11px]'>
                                    Your information is only used for identity verification
                                </p>
                            </div>
                            <button
                                onClick={() => setFlow('camera')}
                                className="h-12 relative rounded-btn-m [@media(max-height:650px)]:h-10 [@media(min-height:700px)]:py-3 border leading-[1] px-3 [@media(min-width:450px)]:px-6 [@media(min-width:400px)]:px-4 py-2 border-bc-button-1 bg-bc-button-1 text-bc-button-text-1 font-bc-font mt-auto mx-auto w-full">
                                Continue

                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>

    )
}