import crypto from 'crypto';

export interface EncryptionConfig {
  algorithm?: string;
  keyLength?: number;
  ivLength?: number;
}

export class Encryption {
  private algorithm: string;
  private keyLength: number;
  private ivLength: number;
  private masterKey: Buffer;

  constructor(config: EncryptionConfig = {}) {
    this.algorithm = config.algorithm || 'aes-256-gcm';
    this.keyLength = config.keyLength || 32;
    this.ivLength = config.ivLength || 16;
    
    const keyString = process.env.ENCRYPTION_KEY;
    if (!keyString) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }
    
    this.masterKey = crypto.scryptSync(keyString, 'salt', this.keyLength);
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // For GCM mode, we need to get the auth tag
    let authTag: Buffer;
    if (this.algorithm.includes('gcm') || this.algorithm.includes('GCM')) {
      authTag = (cipher as crypto.CipherGCM).getAuthTag();
    } else {
      authTag = Buffer.alloc(0);
    }
    
    // Format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  }

  decrypt(encryptedText: string): string {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
    
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(this.algorithm, this.masterKey, iv);
    
    // For GCM mode, set the auth tag
    if (this.algorithm.includes('gcm') || this.algorithm.includes('GCM')) {
      (decipher as crypto.DecipherGCM).setAuthTag(authTag);
    }
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  hash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  generateSecureId(): string {
    return crypto.randomUUID();
  }

  static generateApiKeyIdentifier(apiKey: string): string {
    // Return last 4 characters for identification
    return apiKey.slice(-4);
  }
}

// Rate limiting utilities
export class RateLimiter {
  private store: Map<string, { count: number; resetTime: number }> = new Map();
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 900000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      // New window
      this.store.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs
      };
    }

    if (record.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime
      };
    }

    record.count++;
    
    return {
      allowed: true,
      remaining: this.maxRequests - record.count,
      resetTime: record.resetTime
    };
  }

  reset(key: string): void {
    this.store.delete(key);
  }
}

// Encryption and RateLimiter are already exported as classes above
