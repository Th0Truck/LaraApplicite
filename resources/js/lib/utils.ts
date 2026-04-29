import type { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function getCsrfToken(): string | null {
    return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || null;
}

type FetchJsonInit = Omit<RequestInit, 'body'> & {
    body?: any;
    debug?: boolean;
};

export async function fetchJson<T = any>(input: RequestInfo, init: FetchJsonInit = {}): Promise<T> {
    const headers = new Headers(init.headers || undefined);
    const csrfToken = getCsrfToken();
    const debug = init.debug ?? false;

    if (csrfToken) {
        headers.set('X-CSRF-TOKEN', csrfToken);
    }

    if (init.body !== undefined && init.body !== null && !(init.body instanceof FormData)) {
        if (typeof init.body !== 'string') {
            headers.set('Content-Type', 'application/json');
            init.body = JSON.stringify(init.body);
        }
    }

    if (debug) {
        console.debug('[fetchJson] request:', {
            input,
            method: init.method ?? 'GET',
            headers: Object.fromEntries(headers.entries()),
            body: init.body,
        });
    }

    const response = await fetch(input, {
        ...init,
        headers,
    });

    const responseText = await response.text();
    let data: any = null;

    try {
        data = responseText ? JSON.parse(responseText) : null;
    } catch {
        data = responseText;
    }

    if (debug) {
        console.debug('[fetchJson] response:', {
            url: typeof input === 'string' ? input : input.toString(),
            status: response.status,
            ok: response.ok,
            data,
        });
    }

    if (!response.ok) {
        const errors = data?.errors;
        const message = data?.message ||
            (errors ? Object.values(errors).flat().join(' ') : response.statusText);
        throw new Error(message || 'Request failed');
    }

    return data as T;
}
