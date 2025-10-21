/**
 * Credential Generator for Admin Setup
 *
 * Generates simple, memorable admin credentials
 * Username: mkrentals (business name)
 * Password: MKRentals2024! (brand + year + symbol)
 */

export function generateSimpleCredentials() {
  const currentYear = new Date().getFullYear();

  return {
    username: 'mkrentals',
    password: `MKRentals${currentYear}!`,
    info: {
      pattern: 'Business name + Current year + !',
      example: 'Easy to remember and professional',
      strength: 'Strong enough for admin panel (14+ chars, mixed case, numbers, symbols)'
    }
  };
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password) {
  const checks = {
    minLength: password.length >= 12,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;
  const strength = score >= 4 ? 'strong' : score >= 3 ? 'medium' : 'weak';

  return {
    ...checks,
    score,
    strength,
    isValid: score >= 4
  };
}
