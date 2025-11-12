# Improvement Plan

## Demo Code Refactoring

- **Hardcoded Secrets Demo**
  - Add explicit comments and warnings about insecure patterns.
  - Ensure all hardcoded secrets are clearly marked as unsafe.
  - Remove any production-like secrets.

- **Shared Secrets Demo**
  - Add comments and warnings about risks of committed secrets files.
  - Recommend environment variable usage as an alternative.
  - Remove any production-like secrets.

- **Environment Variables Demo**
  - Add validation for required environment variables.
  - Implement error handling for missing variables.
  - Update `.env.example` for clarity.

## Configuration Updates

- Update `.env.example` and config templates to document required variables and usage.

## Testing

- Run all demos and verify validation, warnings, and error handling.
- Check for absence of committed secrets.

## Documentation

- Update documentation to reflect code and configuration changes.

## Next Steps

Begin refactoring demo code and configuration files as described above.
