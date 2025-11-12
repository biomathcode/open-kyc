
import { useState } from 'react'
import { InfoIcon } from 'lucide-react'
import { country } from "./index";
import type { flowStates } from './index'
import { FileTrigger } from "~/components/ui/file-trigger"
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from '~/components/ui/select';
import { Label } from "~/components/ui/field";



export const CameraView = ({ setFlow }: { setFlow: (flow: flowStates) => void }) => {

    const [isLoading, setLoading] = useState(false)

    const handleSelect = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        setLoading(true)
        await new Promise((r) => setTimeout(r, 4500))
        setLoading(false)
    }

    return <div className="relative flex-1">
        <div className="h-full">
            <div className="wrapper h-full flex grow flex-col justify-between  rounded-t-pnl-xl bg-transparent p-6 pt-3 text-center md:pt-4 [@media(max-height:670px)]:p-4 [@media(max-height:670px)]:pt-2 [@media(max-height:670px)]:rounded-t-pnl-l">
                <div className='mx-auto flex size-full max-w-md flex-col items-center'>
                    <div className="scrollbar-none max-h-full w-full flex-1 overflow-scroll gap-2 flex flex-col">
                        <div className="mx-auto mb-6 w-full sm:max-w-[440px] [@media(max-height:700px)]:mb-3">
                            <h4 className="text-2xl font-medium text-start mb-2 leading-[110%] tracking-[-1.2px] font-bc-font text-bc-primary [@media(max-height:700px)]:text-xl [@media(max-width:390px)]:text-xl [@media(max-height:700px)]:mb-1.5 [@media(max-width:390px)]:mb-1.5 [@media(max-height:600px)]:mb-1 [@media(max-width:350px)]:mb-1">
                                Prepare Document
                            </h4>
                            <p className="text-[14px] leading-[140%] tracking-[-0.78px] text-bc-secondary max-w-xs text-start">
                                You will need to scan both sides of the ID. Make sure you capture a clean and complete image
                            </p>
                        </div>
                        <div className="flex justify-between gap-2 text-start">
                            <Select className="w-full" aria-label="Users" placeholder="Select a user">
                                <Label>Select a language</Label>
                                <SelectTrigger />
                                <SelectContent items={country}>
                                    {(item) => (
                                        <SelectItem textValue={item.name}>
                                            {/* <Avatar src={item.image_url} /> */}
                                            <SelectLabel>{item.name}</SelectLabel>
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            <Select className="w-full" aria-label="country" placeholder="Select Country">
                                <Label className="font-semibold">
                                    Country of origin:
                                </Label>
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

                        <FileTrigger className=" flex flex-col text-start  mt-3 w-full" onSelect={handleSelect} isPending={isLoading}>
                            <div className="flex items-center w-full ">

                                <div className="flex flex-col gap-2">
                                    {isLoading ? "Uploading..." : "Upload a file"}
                                </div>

                            </div>
                            <div className="text-neutral-400 text-xs">
                                JPG, JPEG, PNG, WEBP, TIFF, PDF less than 10MB
                            </div>

                        </FileTrigger>

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
                        onClick={() => setFlow('frontSide')}
                        className="h-12 relative rounded-btn-m [@media(max-height:650px)]:h-10 [@media(min-height:700px)]:py-3 border leading-[1] px-3 [@media(min-width:450px)]:px-6 [@media(min-width:400px)]:px-4 py-2 border-bc-button-1 bg-bc-button-1 text-bc-button-text-1 font-bc-font mt-auto mx-auto w-full">
                        Take a photo of a Front Side

                    </button>
                </div>
            </div>

        </div>

    </div>
}
