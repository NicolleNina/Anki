import { writable } from "svelte/store";

export const active = writable("");
export const noteFieldsData = writable({});
export const zoomResetValue = writable(1);
