import QRCode from "react-qr-code"
import type { flowStates } from "."
import { Button } from "~/components/ui/button";
import { Avatar } from "~/components/ui/avatar";
import { Label } from "~/components/ui/field";
import { Link } from "~/components/ui/link";



export const StartKycWelcome = ({ setFlow }: { setFlow: (flow: flowStates) => void }) => {


    return <div className=" h-full flex-col justify-between grow overflow-auto rounded-b-pnl-xl bg-bc-background p-6 pb-4 text-center md:p-8 md:pb-6">

        <div className="flex flex-col gap-6 justify-between h-full">
            <div className="flex flex-col items-center gap-1 self-stretch">
                <div className="flex w-full justify-center">
                    <Link href="/" className="flex items-center gap-x-2">
                        <Avatar
                            isSquare
                            size="md"
                            className=""
                            src="/logo.svg"
                        />
                        <Label className="font-medium lg:text-2xl">
                            Open<span className="text-muted-fg">KYC</span>
                        </Label>
                    </Link>
                </div>
                <div className="flex w-[700px] items-center justify-center gap-6 self-stretch px-10 py-8 [@media(max-width:750px)]:w-full">

                    <div className='flex max-w-[314px] flex-col items-start gap-2 self-stretch rounded-pnl-m border border-bc-surface-2/10 bg-bc-background p-4 font-bc-font'>
                        <div className="flex flex-col items-start gap-1.5"><p className="text-sm font-medium leading-[90%] tracking-[-0.84px] text-bc-primary">Scan QR code</p><p className="text-start text-[14px] leading-[140%] tracking-[-0.78px] text-bc-secondary">Scan the code to start the process and continue to another device</p></div>
                        <div className="relative items-center justify-center rounded-pnl-m bg-white p-3">
                            <div className="size-fit flex items-center justify-center relative overflow-hidden aspect-square text-primary
                        
                        ">
                                <div style={{ height: "auto", margin: "0 auto", width: "100%" }}>
                                    <QRCode
                                        size={256}
                                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                        value={'value'}
                                        viewBox={`0 0 256 256`}
                                    />
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            <div className='flex flex-col items-center gap-4'>
                <div className="flex w-full max-w-[700px] flex-col items-center gap-1">
                    <Button
                        intent="primary"
                        onClick={() => setFlow('document')}
                        className="w-full"
                    >
                        Continue
                    </Button>
                </div>
            </div>

        </div>

    </div>
}
