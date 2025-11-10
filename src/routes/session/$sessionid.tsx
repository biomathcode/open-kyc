import { BackwardIcon } from '@heroicons/react/24/solid';
import { createFileRoute } from '@tanstack/react-router'
import { InfoIcon, StepBackIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Description, Label } from '~/components/ui/field';
import { ProgressBar, ProgressBarTrack } from '~/components/ui/progress-bar';
import { Radio, RadioGroup } from '~/components/ui/radio';
import { Select, SelectContent, SelectItem, SelectTrigger } from '~/components/ui/select';

// TODO: Get the Workflow Id, get branding, get session, get information

// TODO: Mobile UI Optimized
// TODO: Background Check
// TODO: Get Analytics
// TODO: Add Camera Feed 

export const Route = createFileRoute('/session/$sessionid')({
    component: RouteComponent,
})

function RouteComponent() {
    const { sessionid: id } = Route.useParams();

    const [flow, setFlow] = useState<'start' | 'document' | 'liveliness'>('start')

    return <div className='container w-full h-full backdrop-blur-3xl'>
        <div className="h-(--screenHeight) flex h-[--screenHeight] items-center justify-center md:p-2" data-testid="start-kyc-welcome" id="start-kyc-welcome"
            style={{ "--screenHeight": "962px", "opacity": 1, "transform": "none" }}>
            <div className="overflow-hidden p-0 shadow-card flex size-full w-fit flex-col rounded-none bg-transparent md:max-h-fit md:overflow-hidden md:rounded-pnl-xl" data-testid="start-kyc-welcome" id="start-kyc-welcome">
                {
                    flow === 'start' && <StartKycWelcome setFlow={setFlow} />
                }
                {
                    flow === 'document' && <DocumentStep setFlow={setFlow} />
                }

            </div>
        </div>
    </div>
}



const StartKycWelcome = ({ setFlow }: { setFlow: (flow: 'start' | 'document' | 'liveliness') => void }) => {


    return <div className="grow overflow-auto rounded-b-pnl-xl bg-bc-background p-6 pb-4 text-center md:p-8 md:pb-6">

        <div className="flex flex-col gap-6"><div className="flex flex-col items-center gap-1 self-stretch">
            <div className="flex w-full justify-between">
                <div className="flex w-16 justify-start">
                    OpenKYC
                </div>
            </div>
        </div>
            <div className="flex w-[700px] items-center justify-center gap-6 self-stretch px-10 py-8 [@media(max-width:750px)]:w-full">
                <div className="mx-auto flex min-w-[314px] justify-end px-10 py-4">
                    Steps
                </div>
                <div className='flex max-w-[314px] flex-col items-start gap-2 self-stretch rounded-pnl-m border border-bc-surface-2/10 bg-bc-background p-4 font-bc-font'>
                    <div className="flex flex-col items-start gap-1.5"><p className="text-sm font-medium leading-[90%] tracking-[-0.84px] text-bc-primary">Scan QR code</p><p className="text-start text-[14px] leading-[140%] tracking-[-0.78px] text-bc-secondary">Scan the code to start the process and continue to another device</p></div>
                    <div className="relative items-center justify-center rounded-pnl-m bg-white p-3">
                        <div className="size-fit flex items-center justify-center relative overflow-hidden aspect-square text-primary">
                            ADD QR CODE HERE
                        </div>
                    </div>


                </div>
            </div>
            <div className='flex flex-col items-center gap-4'>
                <div className="flex w-full max-w-[700px] flex-col items-center gap-1">
                    <button
                        onClick={() => setFlow('document')}
                        className="h-12 relative rounded-btn-m [@media(max-height:650px)]:h-10 [@media(min-height:700px)]:py-3 border leading-[1] px-3 [@media(min-width:450px)]:px-6 [@media(min-width:400px)]:px-4 py-2 border-bc-button-1 bg-bc-button-1 text-bc-button-text-1 font-bc-font mx-auto my-3 w-full max-w-[700px]">
                        Continue
                    </button>
                </div>
            </div>

        </div>

    </div>
}


const DocumentStep = ({ setFlow }: { setFlow: (flow: 'start' | 'document' | 'liveliness') => void }) => {

    // documnet selection -> type of id select, country select


    return (
        <div className="flex flex-col gap-2 w-full px-2 py-2">
            <div className="mx-auto flex w-full max-w-md justify-center pt-6 md:pt-12 [@media(max-height:700px)]:pt-4">
                <div className="flex justify-between items-center gap-10 w-full">
                    <Button intent='plain' className=" text-start" onClick={() => { setFlow('start') }}>
                        <StepBackIcon size="14" />
                    </Button>
                    <ProgressBar className="w-full" value={30}>
                        <ProgressBarTrack />
                    </ProgressBar>
                </div>
            </div>

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
                                        <SelectContent items={[
                                            { id: '1', name: 'USA' },
                                            { id: '2', name: 'Canada' },
                                            { id: '3', name: 'Mexico' },
                                        ]}>
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
                            <button className="h-12 relative rounded-btn-m [@media(max-height:650px)]:h-10 [@media(min-height:700px)]:py-3 border leading-[1] px-3 [@media(min-width:450px)]:px-6 [@media(min-width:400px)]:px-4 py-2 border-bc-button-1 bg-bc-button-1 text-bc-button-text-1 font-bc-font mt-auto mx-auto w-full">
                                Continue

                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>

    )
}