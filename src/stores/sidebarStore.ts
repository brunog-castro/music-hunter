import { createState, useState } from '@hookstate/core';
import { SidebarConfig } from '../models/sidebar/siderbar-config';

const sidebarState: any = createState({
    opened: false,
    data: undefined,
});
const stateWrapper = (state: any) => ({
    getState: (): SidebarConfig => state?.value,
    setState: (config: SidebarConfig) =>
        state.set((s: SidebarConfig) => ({ ...s, ...config }))
});

export const accessSidebar = () => stateWrapper(sidebarState);
export const useSidebar = () => stateWrapper(useState(sidebarState));