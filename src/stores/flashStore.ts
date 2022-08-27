import { createState, useState } from '@hookstate/core';

interface FlashOptions {
    message?: string;
    active?: boolean;
    delayInMs?: number;
    type?: "success" | "error" | "warning" | "info";
};

const flashState: any = createState({ active: false });
const stateWrapper = (state: any) => ({
    getOptions: (): FlashOptions => state?.value,
    show: (options: FlashOptions): void => {
        state?.set((p: FlashOptions) => {
            p.active = true;
            p.message = options.message;
            p.type = options.type || "info";
            p.delayInMs = options.delayInMs || 3000;

            setTimeout(() => accessFlash().close(), p.delayInMs);

            return p;
        });
    },
    close: () => {
        var el = document.getElementById("flash-message");
        el?.classList.add("closing");
        setTimeout(() => {
            state?.set((p: FlashOptions) => {
                p.active = false;
                return p;
            });
            el?.classList.remove("closing");
        }, 600);
    }
});

export const accessFlash = () => stateWrapper(flashState);
export const useFlash = () => stateWrapper(useState(flashState));