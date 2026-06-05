export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';
import type { PageMenuItem } from './navigation';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    pages?: PageMenuItem[];
    [key: string]: unknown;
};
