import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function slugify(str: string) {
    return str
        .toLowerCase()
        .replace(/ & /g, "-and-")
        .replace(/&/g, "-and-") // handle & without spaces
        .replace(/,/g, "") // remove commas
        .replace(/\s+/g, "-") // replace spaces with -
        .replace(/-+/g, "-") // collapse multiple -
        .replace(/^-|-$/g, ""); // trim -
}
