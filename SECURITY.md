# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for
receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.2.x   | :white_check_mark: |
| < 1.2   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within orika-js, please follow these steps:

### 1. **DO NOT** Disclose Publicly

Please do not create a public GitHub issue for security vulnerabilities.

### 2. Report via GitHub Security Advisory

The best way to report a security vulnerability is through GitHub's Security Advisory feature:

1. Go to the [Security tab](https://github.com/stevenleep/orika-js/security) of the repository
2. Click "Report a vulnerability"
3. Fill out the security advisory form

### 3. Alternative: Email Report

If you prefer, you can send an email with details to the maintainers via GitHub.

### What to Include

When reporting a vulnerability, please include:

- **Type of vulnerability** (e.g., XSS, SQL injection, buffer overflow, etc.)
- **Full paths of source files** related to the vulnerability
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact of the vulnerability**, including how an attacker might exploit it

### What to Expect

After you submit a vulnerability report:

1. **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
2. **Assessment**: We will assess the vulnerability and determine its impact and severity
3. **Timeline**: We will provide an estimated timeline for a fix
4. **Updates**: We will keep you informed about the progress
5. **Credit**: If you wish, we will credit you in the security advisory and release notes

### Disclosure Policy

- **Security fixes** are released as soon as possible
- **Public disclosure** happens only after a fix is available
- **Credit** is given to reporters who wish to be acknowledged

## Security Best Practices

When using orika-js in your projects:

1. **Keep dependencies updated**: Always use the latest stable version
2. **Validate input data**: Always validate and sanitize source objects before mapping
3. **Use TypeScript strict mode**: Enable strict type checking in your tsconfig.json
4. **Review custom converters**: Carefully review any custom converter logic
5. **Avoid dynamic code**: Don't use expression evaluation with untrusted input

## Security Features

orika-js includes several security-conscious features:

- **Type Safety**: Strong TypeScript typing prevents many runtime errors
- **No eval()**: Expression evaluation uses safe parsing, not eval()
- **Input Validation**: Built-in validation hooks for data verification
- **Immutable Operations**: Mapping doesn't modify source objects by default
- **Error Handling**: Comprehensive error handling prevents undefined behavior

## Known Limitations

Please be aware of these security considerations:

1. **Prototype Pollution**: While we take measures to prevent it, be cautious with deeply nested object mapping
2. **Circular References**: Circular object references could cause infinite loops; use appropriate configuration
3. **Large Objects**: Very large objects or arrays might cause memory issues; consider batch processing

## Security Updates

Security updates will be:
- Released as patch versions (e.g., 1.2.1 → 1.2.2)
- Announced in GitHub Security Advisories
- Documented in CHANGELOG.md
- Tagged with `security` label in releases

## Questions?

If you have questions about security that don't involve reporting a vulnerability:
- Open a GitHub Discussion
- Check existing issues and discussions
- Review the documentation

## Acknowledgments

We thank the security researchers and community members who help keep orika-js secure.

---

**Thank you for helping keep orika-js and its users safe!** 🔒

