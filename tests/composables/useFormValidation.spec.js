import { describe, it, expect } from 'vitest'
import { useFormValidation, required, email, minLength, match } from '@/composables/useFormValidation'

describe('useFormValidation', () => {
  describe('required rule', () => {
    it('should return error string for empty value', () => {
      const rule = required('Este campo es obligatorio')
      const result = rule('')
      expect(typeof result).toBe('string')
      expect(result).toBe('Este campo es obligatorio')
    })

    it('should return true for valid value', () => {
      const rule = required('Este campo es obligatorio')
      expect(rule('hello')).toBe(true)
    })

    it('should return error for null/undefined', () => {
      const rule = required('Requerido')
      expect(rule(null)).toBe('Requerido')
      expect(rule(undefined)).toBe('Requerido')
    })
  })

  describe('email rule', () => {
    it('should return error string for invalid email', () => {
      const rule = email('Email inválido')
      expect(typeof rule('notanemail')).toBe('string')
      expect(rule('notanemail')).toBe('Email inválido')
    })

    it('should return true for valid email', () => {
      const rule = email('Email inválido')
      expect(rule('test@example.com')).toBe(true)
    })

    it('should return error for empty string', () => {
      const rule = email('Email inválido')
      expect(typeof rule('')).toBe('string')
    })
  })

  describe('minLength rule', () => {
    it('should return error string when value is too short', () => {
      const rule = minLength(6, 'Mínimo 6 caracteres')
      const result = rule('abc')
      expect(typeof result).toBe('string')
      expect(result).toBe('Mínimo 6 caracteres')
    })

    it('should return true when value meets minimum length', () => {
      const rule = minLength(6, 'Mínimo 6 caracteres')
      expect(rule('abcdef')).toBe(true)
    })

    it('should return true when value exceeds minimum length', () => {
      const rule = minLength(6, 'Mínimo 6 caracteres')
      expect(rule('abcdefgh')).toBe(true)
    })
  })

  describe('match rule', () => {
    it('should return error string when values do not match', () => {
      const rule = match('password123', 'Las contraseñas no coinciden')
      expect(typeof rule('password456')).toBe('string')
      expect(rule('password456')).toBe('Las contraseñas no coinciden')
    })

    it('should return true when values match', () => {
      const rule = match('password123', 'Las contraseñas no coinciden')
      expect(rule('password123')).toBe(true)
    })
  })

  describe('useFormValidation', () => {
    it('should return a rules object from schema', () => {
      const schema = {
        name: [required('Nombre requerido')],
        email: [required('Email requerido'), email('Email inválido')],
      }
      const rules = useFormValidation(schema)
      expect(rules).toHaveProperty('name')
      expect(rules).toHaveProperty('email')
      expect(Array.isArray(rules.name)).toBe(true)
      expect(Array.isArray(rules.email)).toBe(true)
    })

    it('should validate through the rules object', () => {
      const schema = {
        email: [required('Email requerido'), email('Email inválido')],
      }
      const rules = useFormValidation(schema)

      // Empty should trigger required
      expect(typeof rules.email[0]('')).toBe('string')
      // Invalid should trigger email rule
      expect(typeof rules.email[1]('notanemail')).toBe('string')
      // Valid should pass all
      expect(rules.email[0]('test@example.com')).toBe(true)
      expect(rules.email[1]('test@example.com')).toBe(true)
    })

    it('should handle schema with no rules gracefully', () => {
      const rules = useFormValidation({})
      expect(rules).toEqual({})
    })
  })
})
