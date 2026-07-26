/**
 * Rule factories for Vuetify-compatible form validation.
 * Each rule returns a function (value) => string | true.
 */

/**
 * Creates a required field rule.
 * @param {string} message - Error message when field is empty
 * @returns {function} Validation rule
 */
export function required(message) {
  return (value) => {
    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
      return message
    }
    return true
  }
}

/**
 * Creates an email format validation rule.
 * @param {string} message - Error message for invalid email
 * @returns {function} Validation rule
 */
export function email(message) {
  return (value) => {
    if (!value || typeof value !== 'string') return message
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value) ? true : message
  }
}

/**
 * Creates a minimum length validation rule.
 * @param {number} min - Minimum number of characters
 * @param {string} message - Error message when too short
 * @returns {function} Validation rule
 */
export function minLength(min, message) {
  return (value) => {
    if (!value || typeof value !== 'string') return message
    return value.length >= min ? true : message
  }
}

/**
 * Creates a field matching rule (e.g. password confirmation).
 * @param {*} targetValue - The value to compare against
 * @param {string} message - Error message when values don't match
 * @returns {function} Validation rule
 */
export function match(targetValue, message) {
  return (value) => {
    return value === targetValue ? true : message
  }
}

/**
 * Composable that converts a schema of rule arrays into a Vuetify-compatible rules object.
 * @param {Object} schema - { fieldName: [rule1, rule2, ...] }
 * @returns {Object} { fieldName: [rule1, rule2, ...] } — same structure, ready for v-text-field :rules
 */
export function useFormValidation(schema) {
  const rules = {}
  for (const field in schema) {
    if (schema[field] && Array.isArray(schema[field])) {
      rules[field] = [...schema[field]]
    }
  }
  return rules
}
