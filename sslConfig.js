// sslConfig.js
/**
 * @warning
 * Setting NODE_TLS_REJECT_UNAUTHORIZED to '0' makes TLS connections and HTTPS requests insecure by disabling certificate verification.
 * This should only be used in a trusted local development environment.
 * Do not use this setting in production environments as it exposes the application to security vulnerabilities.
 */
export const setupInsecureSSL = () => {
  // Override process.emitWarning to handle NODE_TLS_REJECT_UNAUTHORIZED
  const originalEmitWarning = process.emitWarning;
  process.emitWarning = (warning, ...args) => {
    if (
      typeof warning === 'string' &&
      warning.includes('NODE_TLS_REJECT_UNAUTHORIZED')
    ) {
      return;
    }
    originalEmitWarning(warning, ...args);
  };

  // Override process.emit to handle self-signed certificate errors
  const originalEmit = process.emit;
  process.emit = (event, ...args) => {
    if (event === 'uncaughtException' || event === 'unhandledRejection') {
      const error = args[0];
      if (
        error &&
        typeof error.message === 'string' &&
        error.message.includes('DEPTH_ZERO_SELF_SIGNED_CERT')
      ) {
        return false;
      }
    }
    return originalEmit.apply(process, [event, ...args]);
  };
};
