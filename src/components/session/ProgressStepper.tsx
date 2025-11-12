/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { ArrowBigLeft } from 'lucide-react';

import type { flowStates } from './index';
import { ProgressBar, ProgressBarTrack } from '~/components/ui/progress-bar';
import { Button } from '~/components/ui/button';

const progressMap: Record<flowStates, number> = {
    start: 0,
    document: 10,
    camera: 30,
    frontSide: 50,
    backSide: 70,
    liveliness: 90,
    success: 100,
};

function ProgressStepper({
    flow,
    setFlow,
}: {
    flow: flowStates;
    setFlow: (flow: flowStates) => void;
}) {
    const progress = progressMap[flow] ?? 0;

    return (
        <div className="mx-auto flex w-full max-w-md justify-center pt-6 md:pt-12 [@media(max-height:700px)]:pt-4">
            <div className="flex justify-between items-center gap-10 w-full">
                <Button
                    intent="plain"
                    className="text-start"
                    onClick={() => setFlow("start")}
                >
                    <ArrowBigLeft size={16} />
                </Button>
                <ProgressBar className="w-full" value={progress}>
                    <ProgressBarTrack />
                </ProgressBar>
            </div>
        </div>
    );
}

export default ProgressStepper;