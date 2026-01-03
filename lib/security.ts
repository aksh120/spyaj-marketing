/**
 * SPYAJ Security Library
 * =======================
 * Comprehensive input validation, sanitization, and security utilities
 * following OWASP best practices.
 * 
 * @module lib/security
 */

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    sanitizedValue?: string | number | boolean;
}

export interface RateLimitEntry {
    count: number;
    resetTime: number;
}

export interface RateLimitConfig {
    windowMs: number;      // Time window in milliseconds
    maxRequests: number;   // Maximum requests per window
    message?: string;      // Custom error message
}

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/**
 * Predefined validation rules for common field types
 * OWASP: Input Validation - Use allowlists over denylists
 */
export const ValidationSchemas = {
    // Email: RFC 5322 compliant pattern
    email: {
        pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        maxLength: 254,
        minLength: 5,
        message: "Please enter a valid email address"
    },

    // Name: Letters, spaces, hyphens, apostrophes only
    name: {
        pattern: /^[a-zA-Z\s\-']+$/,
        maxLength: 100,
        minLength: 2,
        message: "Name can only contain letters, spaces, hyphens, and apostrophes"
    },

    // Phone (Indian format): +91 followed by 10 digits or just 10 digits
    phoneIN: {
        pattern: /^(\+91[\-\s]?)?[6-9]\d{9}$/,
        maxLength: 15,
        minLength: 10,
        message: "Please enter a valid Indian phone number"
    },

    // General text: No script tags or SQL injection patterns
    safeText: {
        pattern: /^[^<>{}]*$/,
        maxLength: 1000,
        minLength: 1,
        message: "Text contains invalid characters"
    },

    // Message/Description: Longer text with basic sanitization
    message: {
        pattern: /^[^<>]*$/,
        maxLength: 5000,
        minLength: 10,
        message: "Message contains invalid characters or is too short"
    },

    // Product name: Alphanumeric with common special chars
    productName: {
        pattern: /^[a-zA-Z0-9\s\-_.,()&]+$/,
        maxLength: 200,
        minLength: 2,
        message: "Product name contains invalid characters"
    },

    // Quantity: Positive integers or decimal numbers
    quantity: {
        pattern: /^\d+(\.\d{1,2})?$/,
        maxLength: 15,
        minLength: 1,
        message: "Please enter a valid quantity"
    },

    // Price/Amount: Currency format
    amount: {
        pattern: /^\d{1,12}(\.\d{1,2})?$/,
        maxLength: 15,
        minLength: 1,
        message: "Please enter a valid amount"
    },

    // URL: Basic URL validation
    url: {
        pattern: /^https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9]*(\.[a-zA-Z0-9][-a-zA-Z0-9]*)*(:\d+)?(\/[-a-zA-Z0-9@:%._+~#=]*)*(\?[-a-zA-Z0-9@:%._+~#&=]*)?(#[-a-zA-Z0-9@:%._+~#&=]*)?$/,
        maxLength: 2048,
        minLength: 10,
        message: "Please enter a valid URL"
    },

    // Subject dropdown: Limited allowed values
    subject: {
        allowedValues: [
            "General Inquiry",
            "Become a Seller",
            "Trade Dispute",
            "Enterprise Solutions",
            "Technical Support"
        ],
        message: "Please select a valid subject"
    },

    // Category dropdown
    category: {
        allowedValues: [
            "Select Category",
            "Textiles",
            "Industrial Machinery",
            "Electronics",
            "Chemicals"
        ],
        message: "Please select a valid category"
    }
} as const;

// =============================================================================
// SANITIZATION FUNCTIONS
// =============================================================================

/**
 * Sanitizes input by removing potentially dangerous characters
 * OWASP: XSS Prevention - Encode output, sanitize input
 * 
 * @param input - Raw user input
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
        return '';
    }

    return input
        // Remove null bytes
        .replace(/\0/g, '')
        // Remove script tags and their content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        // Remove event handlers
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        // Remove javascript: protocol
        .replace(/javascript:/gi, '')
        // Remove data: protocol (can contain scripts)
        .replace(/data:/gi, '')
        // Encode HTML entities
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        // Trim whitespace
        .trim();
}

/**
 * Sanitizes input for SQL-like contexts (even though we use parameterized queries)
 * Defense in depth approach
 * 
 * @param input - Raw user input
 * @returns Sanitized string
 */
export function sanitizeForDatabase(input: string): string {
    if (typeof input !== 'string') {
        return '';
    }

    return input
        // Remove SQL comment syntax
        .replace(/--/g, '')
        .replace(/\/\*/g, '')
        .replace(/\*\//g, '')
        // Remove semicolons (statement terminators)
        .replace(/;/g, '')
        // Apply general sanitization
        .trim();
}

/**
 * Removes all HTML tags from input
 * 
 * @param input - Raw user input
 * @returns Plain text without HTML
 */
export function stripHtml(input: string): string {
    if (typeof input !== 'string') {
        return '';
    }

    return input.replace(/<[^>]*>/g, '').trim();
}

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

/**
 * Validates input against a schema
 * 
 * @param value - Value to validate
 * @param schemaKey - Key from ValidationSchemas
 * @returns ValidationResult object
 */
export function validateField(
    value: unknown,
    schemaKey: keyof typeof ValidationSchemas
): ValidationResult {
    const errors: string[] = [];
    const schema = ValidationSchemas[schemaKey];

    // Type check
    if (typeof value !== 'string') {
        return {
            isValid: false,
            errors: ['Invalid input type'],
        };
    }

    const trimmedValue = value.trim();

    // Check for allowed values (dropdown/select fields)
    if ('allowedValues' in schema) {
        const allowedValues = schema.allowedValues as readonly string[];
        if (!allowedValues.includes(trimmedValue)) {
            errors.push(schema.message);
        }
        return {
            isValid: errors.length === 0,
            errors,
            sanitizedValue: trimmedValue,
        };
    }

    // Length validation
    if ('minLength' in schema && trimmedValue.length < schema.minLength) {
        errors.push(`Minimum length is ${schema.minLength} characters`);
    }

    if ('maxLength' in schema && trimmedValue.length > schema.maxLength) {
        errors.push(`Maximum length is ${schema.maxLength} characters`);
    }

    // Pattern validation
    if ('pattern' in schema && !schema.pattern.test(trimmedValue)) {
        errors.push(schema.message);
    }

    // Sanitize the value
    const sanitizedValue = sanitizeInput(trimmedValue);

    return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue,
    };
}

/**
 * Validates a complete form object against multiple schemas
 * 
 * @param formData - Object containing form field values
 * @param schemaMap - Mapping of field names to schema keys
 * @returns Object with isValid flag and field-specific errors
 */
export function validateForm<T extends Record<string, unknown>>(
    formData: T,
    schemaMap: Partial<Record<keyof T, keyof typeof ValidationSchemas>>
): {
    isValid: boolean;
    errors: Partial<Record<keyof T, string[]>>;
    sanitizedData: Partial<T>;
} {
    const errors: Partial<Record<keyof T, string[]>> = {};
    const sanitizedData: Partial<T> = {};
    let isValid = true;

    // Check for unexpected fields (reject unknown fields)
    const allowedFields = Object.keys(schemaMap);
    for (const field of Object.keys(formData)) {
        if (!allowedFields.includes(field)) {
            errors[field as keyof T] = [`Unexpected field: ${field}`];
            isValid = false;
        }
    }

    // Validate each field according to its schema
    for (const [field, schemaKey] of Object.entries(schemaMap)) {
        if (schemaKey) {
            const value = formData[field as keyof T];
            const result = validateField(value, schemaKey as keyof typeof ValidationSchemas);

            if (!result.isValid) {
                errors[field as keyof T] = result.errors;
                isValid = false;
            } else {
                sanitizedData[field as keyof T] = result.sanitizedValue as T[keyof T];
            }
        }
    }

    return { isValid, errors, sanitizedData };
}

// =============================================================================
// RATE LIMITING (Client-side + Server-side Ready)
// =============================================================================

// In-memory rate limit store (for server-side use)
// In production, use Redis or similar distributed store
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Default rate limit configurations for different endpoint types
 */
export const RateLimitPresets: Record<string, RateLimitConfig> = {
    // Standard endpoints: 100 requests per minute
    standard: {
        windowMs: 60 * 1000,
        maxRequests: 100,
        message: 'Too many requests. Please try again in a minute.'
    },
    // Auth endpoints: 5 requests per 15 minutes (prevent brute force)
    auth: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 5,
        message: 'Too many authentication attempts. Please try again later.'
    },
    // Form submissions: 10 requests per minute
    form: {
        windowMs: 60 * 1000,
        maxRequests: 10,
        message: 'Too many form submissions. Please slow down.'
    },
    // Search/Query: 30 requests per minute
    search: {
        windowMs: 60 * 1000,
        maxRequests: 30,
        message: 'Too many search requests. Please wait a moment.'
    },
    // Sensitive operations: 3 requests per hour
    sensitive: {
        windowMs: 60 * 60 * 1000,
        maxRequests: 3,
        message: 'Rate limit exceeded for this operation.'
    }
};

/**
 * Check if a request is rate limited
 * 
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Object with limited status and retry information
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = RateLimitPresets.standard
): {
    isLimited: boolean;
    remainingRequests: number;
    resetTime: number;
    message?: string;
} {
    const now = Date.now();
    const key = identifier;
    const entry = rateLimitStore.get(key);

    // Clean up expired entries
    if (entry && now > entry.resetTime) {
        rateLimitStore.delete(key);
    }

    const currentEntry = rateLimitStore.get(key);

    if (!currentEntry) {
        // First request in this window
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + config.windowMs
        });
        return {
            isLimited: false,
            remainingRequests: config.maxRequests - 1,
            resetTime: now + config.windowMs
        };
    }

    if (currentEntry.count >= config.maxRequests) {
        // Rate limit exceeded
        return {
            isLimited: true,
            remainingRequests: 0,
            resetTime: currentEntry.resetTime,
            message: config.message
        };
    }

    // Increment counter
    currentEntry.count++;
    rateLimitStore.set(key, currentEntry);

    return {
        isLimited: false,
        remainingRequests: config.maxRequests - currentEntry.count,
        resetTime: currentEntry.resetTime
    };
}

/**
 * Creates a combined identifier from IP and user ID
 * Provides both IP-based and user-based rate limiting
 * 
 * @param ip - Client IP address
 * @param userId - Optional user ID for authenticated users
 * @returns Combined identifier string
 */
export function createRateLimitKey(ip: string, userId?: string): string {
    if (userId) {
        return `user:${userId}:${ip}`;
    }
    return `ip:${ip}`;
}

// =============================================================================
// CSRF TOKEN UTILITIES
// =============================================================================

/**
 * Generates a cryptographically secure random token
 * For use in CSRF protection
 * 
 * @param length - Token length in bytes (default: 32)
 * @returns Hex-encoded token string
 */
export function generateSecureToken(length: number = 32): string {
    // Browser-compatible crypto
    if (typeof window !== 'undefined' && window.crypto) {
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    // Node.js environment
    if (typeof require !== 'undefined') {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const crypto = require('crypto');
            return crypto.randomBytes(length).toString('hex');
        } catch {
            // Fallback for environments without crypto
            console.warn('Secure random not available, using fallback');
        }
    }

    // Fallback (not cryptographically secure - should not be used in production)
    let result = '';
    const characters = '0123456789abcdef';
    for (let i = 0; i < length * 2; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// =============================================================================
// SECURITY HEADERS
// =============================================================================

/**
 * Recommended security headers for Next.js responses
 * To be used in next.config.ts or API routes
 */
export const SecurityHeaders = [
    {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
    },
    {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    },
    {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
    },
    {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    },
    {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
    },
    {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    },
    {
        key: 'Content-Security-Policy',
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: https: blob:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https:",
            "frame-ancestors 'self'",
            "form-action 'self'",
            "base-uri 'self'"
        ].join('; ')
    }
];

// =============================================================================
// EXPORTS SUMMARY
// =============================================================================

export default {
    // Validation
    ValidationSchemas,
    validateField,
    validateForm,

    // Sanitization
    sanitizeInput,
    sanitizeForDatabase,
    stripHtml,

    // Rate Limiting
    RateLimitPresets,
    checkRateLimit,
    createRateLimitKey,

    // Security Utilities
    generateSecureToken,
    SecurityHeaders
};
