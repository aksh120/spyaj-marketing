"use client";

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

export interface UseFormValidationOptions<T> {
  initialValues: T;
  schemaMap: Partial<Record<keyof T, keyof typeof ValidationSchemas>>;
  onSubmit?: (sanitizedData: Partial<T>) => Promise<void> | void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface UseFormValidationReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string[]>>;
  isSubmitting: boolean;
  hasErrors: boolean;
  isDirty: boolean;
  setValue: (field: keyof T, value: string) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  validateSingleField: (field: keyof T) => boolean;
  validateAllFields: () => boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  reset: () => void;
  getSanitizedData: () => Partial<T>;
}

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

  const hasErrors = Object.values(errors).some(
    (fieldErrors) => fieldErrors && fieldErrors.length > 0,
  );

  const setValue = useCallback((field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setValue(name as keyof T, value);

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
    [setValue, validateOnChange, schemaMap],
  );

  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      const { name, value } = e.target;
      setTouched((prev) => new Set(prev).add(name as keyof T));

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
    [validateOnBlur, schemaMap],
  );

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
    [schemaMap, values],
  );

  const validateAllFields = useCallback((): boolean => {
    const result = validateForm(values, schemaMap);
    setErrors(result.errors);
    return result.isValid;
  }, [values, schemaMap]);

  const getSanitizedData = useCallback((): Partial<T> => {
    const sanitized: Partial<T> = {};
    for (const [key, value] of Object.entries(values)) {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
    }
    return sanitized;
  }, [values]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

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
    [validateAllFields, getSanitizedData, onSubmit],
  );

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

export interface UseClientRateLimitOptions {
  key: string;
  config?: RateLimitConfig;
  storage?: "localStorage" | "sessionStorage";
}

export interface UseClientRateLimitReturn {
  isLimited: boolean;
  remainingRequests: number;
  resetTime: number | null;
  timeUntilReset: string;
  checkAndConsume: () => boolean;
  reset: () => void;
}

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageObj =
      storage === "localStorage" ? localStorage : sessionStorage;
    const stored = storageObj.getItem(storageKey);

    if (stored) {
      try {
        const data = JSON.parse(stored);
        const now = Date.now();

        if (data.resetTime > now) {
          setState({
            isLimited: data.count >= config.maxRequests,
            remainingRequests: Math.max(0, config.maxRequests - data.count),
            resetTime: data.resetTime,
          });
        } else {
          storageObj.removeItem(storageKey);
        }
      } catch {
        storageObj.removeItem(storageKey);
      }
    }
  }, [storageKey, config.maxRequests, storage]);

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

  const checkAndConsume = useCallback((): boolean => {
    if (typeof window === "undefined") return true;

    const storageObj =
      storage === "localStorage" ? localStorage : sessionStorage;
    const now = Date.now();

    const stored = storageObj.getItem(storageKey);
    let data = { count: 0, resetTime: now + config.windowMs };

    if (stored) {
      try {
        data = JSON.parse(stored);
        if (data.resetTime <= now) {
          data = { count: 0, resetTime: now + config.windowMs };
        }
      } catch {
        data = { count: 0, resetTime: now + config.windowMs };
      }
    }

    if (data.count >= config.maxRequests) {
      setState({
        isLimited: true,
        remainingRequests: 0,
        resetTime: data.resetTime,
      });
      return false;
    }

    data.count++;
    storageObj.setItem(storageKey, JSON.stringify(data));

    setState({
      isLimited: data.count >= config.maxRequests,
      remainingRequests: Math.max(0, config.maxRequests - data.count),
      resetTime: data.resetTime,
    });

    return true;
  }, [storageKey, config, storage]);

  const reset = useCallback(() => {
    if (typeof window === "undefined") return;

    const storageObj =
      storage === "localStorage" ? localStorage : sessionStorage;
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

export function useSanitizedInput(
  initialValue: string = "",
): [string, string, (value: string) => void] {
  const [rawValue, setRawValue] = useState(initialValue);
  const [sanitizedValue, setSanitizedValue] = useState(
    sanitizeInput(initialValue),
  );

  const setValue = useCallback((value: string) => {
    setRawValue(value);
    setSanitizedValue(sanitizeInput(value));
  }, []);

  return [rawValue, sanitizedValue, setValue];
}

export default {
  useFormValidation,
  useClientRateLimit,
  useDebounce,
  useSanitizedInput,
};
