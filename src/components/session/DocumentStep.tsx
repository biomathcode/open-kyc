import { InfoIcon } from "lucide-react"

import { country } from "./index";
import type { flowStates } from "./index"

import { Button } from '~/components/ui/button';
import { Radio, RadioGroup } from '~/components/ui/radio';
import { Select, SelectContent, SelectItem, SelectTrigger } from '~/components/ui/select';
import { Label } from '~/components/ui/field';


export const DocumentStep = ({ setFlow }: { setFlow: (flow: flowStates) => void }) => {

    return (

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
                                <Radio value="national_id"
                                    className="text-start"
                                >
                                    <Label>National ID card</Label>
                                </Radio>
                                <Radio value="passport"
                                    className="text-start"
                                >
                                    <Label>Passport</Label>
                                </Radio>
                                <Radio value="driver_license"

                                    className="text-start"
                                >
                                    <Label>Driver's license</Label>
                                </Radio>
                                <Radio value="residence_permit"
                                    className="text-start"
                                >
                                    <Label>Residence permit</Label>
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
                                            <SelectItem id={item.iso_code} textValue={item.country}>
                                                {item.country}
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
                        <Button
                            intent="primary"
                            onClick={() => setFlow('camera')}
                            className='w-full'
                        >
                            Continue
                        </Button>
                    </div>
                </div>

            </div>

        </div>

    )
}