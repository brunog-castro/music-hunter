import { useCallback } from 'react';
// @ts-ignore
import debounce from 'lodash.debounce';

export default function useDebounce(callback: any, delay: number) {
    //eslint-disable-next-line
    const debouncedFn = useCallback(
        debounce((...args: any[]) => callback(...args), delay), [delay]
    );

    return debouncedFn;
}