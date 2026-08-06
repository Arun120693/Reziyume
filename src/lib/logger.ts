type LogLevel = 'info' | 'warn' | 'error';

class Logger {
  private log(level: LogLevel, prefix: string, message: string, meta?: unknown) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] ${prefix} [${level.toUpperCase()}] ${message}`;

    // Clean up metadata to ensure we don't accidentally log sensitive information if passed in `meta`
    const safeMeta = this.sanitizeMeta(meta);

    if (safeMeta !== undefined) {
      console[level](formattedMessage, safeMeta);
    } else {
      console[level](formattedMessage);
    }
  }

  private sanitizeMeta(meta?: unknown): unknown {
    if (meta === undefined || meta === null) return undefined;
    
    // Deep clone to avoid mutating the original object
    let safeObj: unknown;
    try {
      safeObj = JSON.parse(JSON.stringify(meta, (key, value) => {
        // Exclude circular references or non-serializable data if needed, but JSON.stringify handles basic cases
        return value;
      }));
    } catch {
      safeObj = typeof meta === 'object' ? { ...meta } : meta;
    }

    if (typeof safeObj === 'object' && safeObj !== null) {
      const sensitiveKeys = ['password', 'passwordhash', 'token', 'secret', 'session', 'accesstoken', 'refreshtoken'];
      
      const sanitize = (obj: Record<string, unknown>) => {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const lowerKey = key.toLowerCase();
            if (sensitiveKeys.some(sensitiveKey => lowerKey.includes(sensitiveKey))) {
              obj[key] = '[REDACTED]';
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              sanitize(obj[key] as Record<string, unknown>);
            }
          }
        }
      };

      sanitize(safeObj as Record<string, unknown>);
    }

    return safeObj;
  }

  info(prefix: string, message: string, meta?: unknown) {
    this.log('info', prefix, message, meta);
  }

  warn(prefix: string, message: string, meta?: unknown) {
    this.log('warn', prefix, message, meta);
  }

  error(prefix: string, message: string, meta?: unknown) {
    // If meta is an Error object, we want to extract the stack trace if possible
    let errorMeta = meta;
    if (meta instanceof Error) {
      errorMeta = {
        message: meta.message,
        name: meta.name,
        stack: meta.stack,
        code: 'code' in meta ? (meta as Error & { code?: unknown }).code : undefined,
      };
    } else if (typeof meta === 'object' && meta !== null && 'message' in meta) {
      // Sometimes errors are serialized objects
      errorMeta = { ...meta };
    }
    
    this.log('error', prefix, message, errorMeta);
  }
}

export const logger = new Logger();
