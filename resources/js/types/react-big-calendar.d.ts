declare module 'react-big-calendar' {
  import * as React from 'react';

  export type View = 'month' | 'week' | 'day' | 'agenda' | string;

  export interface CalendarProps<T = any> extends React.ComponentProps<'div'> {
    localizer: any;
    events: T[];
    startAccessor: string | ((event: T) => Date);
    endAccessor: string | ((event: T) => Date);
    style?: React.CSSProperties;
    onSelectSlot?: (slotInfo: any) => void;
    onSelectEvent?: (event: T) => void;
    onNavigate?: (date: Date, action: string) => void;
    onView?: (view: View) => void;
    view?: View;
    date?: Date;
    views?: View[];
    selectable?: boolean;
    popup?: boolean;
    defaultView?: View;
    toolbar?: boolean;
    messages?: Record<string, string>;
  }

  export function dateFnsLocalizer(options: {
    format: any;
    parse: any;
    startOfWeek: any;
    getDay: any;
    locales: Record<string, any>;
  }): any;

  export function Calendar<T = any>(props: CalendarProps<T>): React.ReactElement;
}
