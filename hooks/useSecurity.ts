"use client";

/**
 * SPYAJ Security Hooks
 * ====================
 * React hooks for form validation and security utilities.
 * 
 * @module hooks/useSecurity
 */

import { useState, useCallback, useEffect, useRef } from "react";
import {
    validateField,
    validateForm,
    sanitizeInput,
    ValidationSchemas,
    checkRateLimit,
    RateLimitPresets,
    type RateLimitConfig,
} from "@/lib/security";

// =============================================================================
// TYPES
// =============================================================================

export interface UseFormValidationOptions<T> {
    /** Initial form values */
    initialValues: T;
    /** Mapping of field names to validation schema keys */
    schemaMap: Partial<Record<keyof T, keyof typeof ValidationSchemas>>;
    /** Callback when form is successfully submitted */
    onSubmit?: (sanitizedData: Partial<T>) => Promise<void> | void;
    /** Validate on every field change */
    validateOnChange?: boolean;
    /** Validate when field loses focus */
    validateOnBlur?: boolean;
}

export interface UseFormValidationReturn<T> {
    /** Current form values */
    values: T;
    /** Field-specific error messages */
    errors: Partial<Record<keyof T, string[]>>;
    /** Whether form is being submitted */
    isSubmitting: boolean;
    /** Whether form has any errors */
    hasErrors: boolean;
    /** Whether form data has been modified */
    isDirty: boolean;
    /** Update a field value */
    setValue: (field: keyof T, value: string) => void;
    /** Handle input change event */
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    /** Handle blur event (validate on blur) */
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    /** Validate single field */
    validateSingleField: (field: keyof T) => boolean;
    /** Validate entire form */
    validateAllFields: () => boolean;
    /** Handle form submission */
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    /** Reset form to initial values */
    reset: () => void;
    /** Get sanitized form data */
    getSanitizedData: () => Partial<T>;
}

// =============================================================================
// useFormValidation HOOK
// =============================================================================

/**
 * Comprehensive form validation hook with built-in sanitization
 * 
 * @example
 * ```tsx
 * const { values, errors, handleChange, handleSubmit } = useFormValidation({
 *   initialValues: { name: '', email: '', message: '' },
 *   schemaMap: {
 *     name: 'name',
 *     email: 'email',
 *     message: 'message',
 *   },
 *   onSubmit: async (data) => {
 *     await fetch('/api/contact', {
 *       method: 'POST',
 *       body: JSON.stringify(data),
 *     });
 *   },
 * });
 * ```
 */
export function useFormValidation<T extends Record<string, string>>({
    initialValues,
    schemaMap,
    onSubmit,
    validateOnChange = false,
    validateOnBlur = true,
}: UseFormValidationOptions<T>): UseFormValidationReturn<T> {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string[]>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [touched, setTouched] = useState<Set<keyof T>>(new Set());

    // Check if form has any errors
    const hasErrors = Object.values(errors).some(
        (fieldErrors) => fieldErrors && fieldErrors.length > 0
    );

    // Update a single field value
    const setValue = useCallback(
        (field: keyof T, value: string) => {
            setValues((prev) => ({ ...prev, [field]: value }));
            setIsDirty(true);
        },
        []
    );

    // Handle input change event
    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setValue(name as keyof T, value);

            // Optionally validate on change
            if (validateOnChange) {
                const schemaKey = schemaMap[name as keyof T];
                if (schemaKey) {
                    const result = validateField(value, schemaKey);
                    setErrors((prev) => ({
                        ...prev,
                        [name]: result.isValid ? undefined : result.errors,
                    }));
                }
            }
        },
        [setValue, validateOnChange, schemaMap]
    );

    // Handle blur event
    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setTouched((prev) => new Set(prev).add(name as keyof T));

            // Validate on blur
            if (validateOnBlur) {
                const schemaKey = schemaMap[name as keyof T];
                if (schemaKey) {
                    const result = validateField(value, schemaKey);
                    setErrors((prev) => ({
                        ...prev,
                        [name]: result.isValid ? undefined : result.errors,
                    }));
                }
            }
        },
        [validateOnBlur, schemaMap]
    );

    // Validate a single field
    const validateSingleField = useCallback(
        (field: keyof T): boolean => {
            const schemaKey = schemaMap[field];
            if (!schemaKey) return true;

            const result = validateField(values[field], schemaKey);
            setErrors((prev) => ({
                ...prev,
                [field]: result.isValid ? undefined : result.errors,
            }));
            return result.isValid;
        },
        [schemaMap, values]
    );

    // Validate all fields
    const validateAllFields = useCallback((): boolean => {
        const result = validateForm(values, schemaMap);
        setErrors(result.errors);
        return result.isValid;
    }, [values, schemaMap]);

    // Get sanitized form data
    const getSanitizedData = useCallback((): Partial<T> => {
        const sanitized: Partial<T> = {};
        for (const [key, value] of Object.entries(values)) {
            sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
        }
        return sanitized;
    }, [values]);

    // Handle form submission
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            // Validate all fields before submission
            const isValid = validateAllFields();
            if (!isValid) {
                return;
            }

            setIsSubmitting(true);
            try {
                const sanitizedData = getSanitizedData();
                await onSubmit?.(sanitizedData);
            } catch (error) {
                console.error("Form submission error:", error);
                throw error;
            } finally {
                setIsSubmitting(false);
            }
        },
        [validateAllFields, getSanitizedData, onSubmit]
    );

    // Reset form to initial values
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setIsDirty(false);
        setTouched(new Set());
    }, [initialValues]);

    return {
        values,
        errors,
        isSubmitting,
        hasErrors,
        isDirty,
        setValue,
        handleChange,
        handleBlur,
        validateSingleField,
        validateAllFields,
        handleSubmit,
        reset,
        getSanitizedData,
    };
}

// =============================================================================
// useClientRateLimit HOOK
// =============================================================================

export interface UseClientRateLimitOptions {
    /** Unique identifier for this rate limit (e.g., 'contact-form', 'search') */
    key: string;
    /** Rate limit configuration */
    config?: RateLimitConfig;
    /** Storage mechanism ('localStorage' or 'sessionStorage') */
    storage?: "localStorage" | "sessionStorage";
}

export interface UseClientRateLimitReturn {
    /** Whether the action is currently rate limited */
    isLimited: boolean;
    /** Number of remaining requests in current window */
    remainingRequests: number;
    /** Timestamp when the rate limit resets */
    resetTime: number | null;
    /** Human-readable time until reset */
    timeUntilReset: string;
    /** Check if action can be performed and decrement counter */
    checkAndConsume: () => boolean;
    /** Reset the rate limit */
    reset: () => void;
}

/**
 * Client-side rate limiting hook for form submissions and actions
 * Uses localStorage/sessionStorage for persistence across page reloads
 * 
 * @example
 * ```tsx
 * const { isLimited, remainingRequests, checkAndConsume } = useClientRateLimit({
 *   key: 'contact-form',
 *   config: RateLimitPresets.form,
 * });
 * 
 * const handleSubmit = () => {
 *   if (!checkAndConsume()) {
 *     alert('Too many submissions. Please try again later.');
 *     return;
 *   }
 *   // Proceed with submission
 * };
 * ```
 */
export function useClientRateLimit({
    key,
    config = RateLimitPresets.form,
    storage = "localStorage",
}: UseClientRateLimitOptions): UseClientRateLimitReturn {
    const [state, setState] = useState<{
        isLimited: boolean;
        remainingRequests: number;
        resetTime: number | null;
    }>({
        isLimited: false,
        remainingRequests: config.maxRequests,
        resetTime: null,
    });

    const storageKey = `rate_limit_${key}`;

    // Load state from storage on mount
    useEffect(() => {
        if (typeof window === "undefined") return;

        const storageObj = storage === "localStorage" ? localStorage : sessionStorage;
        const stored = storageObj.getItem(storageKey);

        if (stored) {
            try {
                const data = JSON.parse(stored);
                const now = Date.now();

                // Check if the stored data is still valid
                if (data.resetTime > now) {
                    setState({
                        isLimited: data.count >= config.maxRequests,
                        remainingRequests: Math.max(0, config.maxRequests - data.count),
                        resetTime: data.resetTime,
                    });
                } else {
                    // Reset expired data
                    storageObj.removeItem(storageKey);
                }
            } catch {
                storageObj.removeItem(storageKey);
            }
        }
    }, [storageKey, config.maxRequests, storage]);

    // Calculate time until reset
    const timeUntilReset = (() => {
        if (!state.resetTime) return "";
        const remaining = state.resetTime - Date.now();
        if (remaining <= 0) return "";

        const seconds = Math.ceil(remaining / 1000);
        if (seconds < 60) return `${seconds} seconds`;
        const minutes = Math.ceil(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
        const hours = Math.ceil(minutes / 60);
        return `${hours} hour${hours > 1 ? "s" : ""}`;
    })();

    // Check and consume a rate limit slot
    const checkAndConsume = useCallback((): boolean => {
        if (typeof window === "undefined") return true;

        const storageObj = storage === "localStorage" ? localStorage : sessionStorage;
        const now = Date.now();

        // Get current state from storage
        const stored = storageObj.getItem(storageKey);
        let data = { count: 0, resetTime: now + config.windowMs };

        if (stored) {
            try {
                data = JSON.parse(stored);
                // Reset if window has expired
                if (data.resetTime <= now) {
                    data = { count: 0, resetTime: now + config.windowMs };
                }
            } catch {
                data = { count: 0, resetTime: now + config.windowMs };
            }
        }

        // Check if limited
        if (data.count >= config.maxRequests) {
            setState({
                isLimited: true,
                remainingRequests: 0,
                resetTime: data.resetTime,
            });
            return false;
        }

        // Increment counter
        data.count++;
        storageObj.setItem(storageKey, JSON.stringify(data));

        setState({
            isLimited: data.count >= config.maxRequests,
            remainingRequests: Math.max(0, config.maxRequests - data.count),
            resetTime: data.resetTime,
        });

        return true;
    }, [storageKey, config, storage]);

    // Reset rate limit
    const reset = useCallback(() => {
        if (typeof window === "undefined") return;

        const storageObj = storage === "localStorage" ? localStorage : sessionStorage;
        storageObj.removeItem(storageKey);

        setState({
            isLimited: false,
            remainingRequests: config.maxRequests,
            resetTime: null,
        });
    }, [storageKey, config.maxRequests, storage]);

    return {
        ...state,
        timeUntilReset,
        checkAndConsume,
        reset,
    };
}

// =============================================================================
// useDebounce HOOK
// =============================================================================

/**
 * Debounce hook to prevent rapid-fire requests
 * Useful for search inputs and auto-save functionality
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// =============================================================================
// useSanitizedInput HOOK
// =============================================================================

/**
 * Hook that automatically sanitizes input value
 */
export function useSanitizedInput(initialValue: string = ""): [
    string,
    string,
    (value: string) => void
] {
    const [rawValue, setRawValue] = useState(initialValue);
    const [sanitizedValue, setSanitizedValue] = useState(sanitizeInput(initialValue));

    const setValue = useCallback((value: string) => {
        setRawValue(value);
        setSanitizedValue(sanitizeInput(value));
    }, []);

    return [rawValue, sanitizedValue, setValue];
}

// =============================================================================
// EXPORTS
// =============================================================================

export default {
    useFormValidation,
    useClientRateLimit,
    useDebounce,
    useSanitizedInput,
};
