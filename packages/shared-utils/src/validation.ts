import Joi from 'joi';
import validator from 'validator';
import xss from 'xss';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

// Common validation schemas
export const schemas = {
  email: Joi.string().email().required(),
  
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }),
  
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  
  apiKey: Joi.string().pattern(/^sk-[a-zA-Z0-9]{20,}$/).required(),
  
  provider: Joi.string().valid('openai', 'anthropic', 'local').required(),
  
  personaName: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9\s-_]+$/)
    .required(),
  
  contentDraft: Joi.string()
    .min(1)
    .max(5000)
    .required(),
  
  platform: Joi.string().valid('linkedin', 'twitter', 'instagram').required(),
  
  status: Joi.string().valid('draft', 'review', 'approved', 'scheduled', 'posted', 'failed', 'rejected').required()
};

export class Validator {
  static validate<T>(schema: Joi.ObjectSchema, data: unknown): ValidationResult<T> {
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      return {
        success: false,
        errors: error.details.map(detail => detail.message)
      };
    }

    return {
      success: true,
      data: value as T
    };
  }

  static validateEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  static validateURL(url: string): boolean {
    return validator.isURL(url);
  }

  static validateUUID(id: string): boolean {
    return validator.isUUID(id);
  }

  static sanitizeString(input: string): string {
    return xss(input, {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script']
    });
  }

  static sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(item => 
          typeof item === 'string' ? this.sanitizeString(item) : item
        );
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }

  static escapeHTML(input: string): string {
    return validator.escape(input);
  }

  static validateJSON(input: string): boolean {
    try {
      JSON.parse(input);
      return true;
    } catch {
      return false;
    }
  }
}

// Input sanitization middleware for Express
export function sanitizeInput(req: any, res: any, next: any): void {
  if (req.body && typeof req.body === 'object') {
    req.body = Validator.sanitizeObject(req.body);
  }
  
  if (req.query && typeof req.query === 'object') {
    req.query = Validator.sanitizeObject(req.query);
  }
  
  if (req.params && typeof req.params === 'object') {
    req.params = Validator.sanitizeObject(req.params);
  }
  
  next();
}

export default Validator;
