export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface JournalAnalysisRequest {
  text: string;
}

export function validateJournalAnalysisRequest(body: any): ValidationResult {
  if (!body) {
    return { isValid: false, error: "Request body is required" };
  }

  if (!body.text) {
    return { isValid: false, error: "Text field is required" };
  }

  if (typeof body.text !== "string") {
    return { isValid: false, error: "Text field must be a string" };
  }

  const trimmedText = body.text.trim();

  if (trimmedText.length === 0) {
    return { isValid: false, error: "Text field cannot be empty" };
  }

  if (trimmedText.length < 10) {
    return {
      isValid: false,
      error: "Text must be at least 10 characters long for meaningful analysis",
    };
  }

  if (trimmedText.length > 10000) {
    return {
      isValid: false,
      error: "Text must be less than 10,000 characters",
    };
  }

  // Check for potentially harmful content patterns
  const suspiciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmedText)) {
      return {
        isValid: false,
        error: "Text contains potentially harmful content",
      };
    }
  }

  return { isValid: true };
}
