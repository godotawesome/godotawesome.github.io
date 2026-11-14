// Shared field styles for Formspree forms. Phones get 16px text (iOS zooms in on smaller
// text when a field is focused) and 44px tall touch targets.
export const inputCls =
  "mt-1 block min-h-11 w-full rounded-md border border-black/10 bg-white px-3 py-2 text-base shadow-sm sm:min-h-0 sm:text-sm placeholder:text-black/30 focus:border-primary focus:outline-none";
export const labelCls = "block text-sm font-semibold text-black/75";
export const submitCls =
  "h-11 rounded-md bg-primary px-5 text-base font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-60 sm:h-10 sm:text-sm";
