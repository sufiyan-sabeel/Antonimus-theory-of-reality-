# Security Policy

## Supported Versions

The Antonimus Theory of Reality book is a static HTML/CSS/JS project. All versions
hosted on GitHub Pages are supported for security updates.

## Reporting a Vulnerability

This project uses the following security mechanisms:

- **GitHub Secret Scanning**: Automatically detects committed secrets.
- **CodeQL Analysis**: Runs on every push to `main` and weekly.
- **Dependabot**: Monitors dependency updates weekly.

If you discover a security vulnerability, please report it by opening a
[GitHub Security Advisory](https://github.com/sufiyan-sabeel/Antonimus-theory-of-reality-/security/advisories/new).

Do not report security vulnerabilities in public GitHub Issues.

## Security Headers

This project implements the following security measures via `<meta>` tags:

- **Content-Security-Policy**: Restricts script/style/font/img sources
- **X-Content-Type-Options**: nosniff
- **Referrer-Policy**: strict-origin-when-cross-origin
- **Permissions-Policy**: Disables camera, microphone, geolocation

## Input Validation

All user-facing inputs (search, quiz answers) are sanitized client-side
to prevent XSS. See `docs/js/security.js` for implementation details.

## Local Storage

No sensitive data is stored in localStorage. Only quiz progress, theme
preference, and reading position are persisted locally.

## Dependency Management

- External CDN resources use Subresource Integrity (SRI) hashes.
- All external resources use HTTPS only.
- Dependabot is configured for automated update monitoring.
