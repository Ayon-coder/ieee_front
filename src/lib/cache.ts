import type { EventRecord } from './api';

// In-memory cache populated by SiteLoader during boot. Pages that need this
// data (e.g. Events) check the cache first, falling back to a network fetch
// when the cache is empty.
type Cache = {
    events?: EventRecord[];
    eventsFetchedAt?: number;
    warmedUp?: boolean;
};

export const cache: Cache = {};

// Cache is considered fresh for 5 minutes after population.
const FRESH_MS = 5 * 60 * 1000;

export function isEventsCacheFresh(): boolean {
    return (
        cache.events !== undefined &&
        cache.eventsFetchedAt !== undefined &&
        Date.now() - cache.eventsFetchedAt < FRESH_MS
    );
}

export function setEvents(events: EventRecord[]): void {
    cache.events = events;
    cache.eventsFetchedAt = Date.now();
}
