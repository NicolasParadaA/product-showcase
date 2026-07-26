import { describe, it, expect } from 'vitest'
import { normalizeText } from '@/utils/search.js'

describe('normalizeText', () => {
  it('converts accented characters to plain ASCII', () => {
    expect(normalizeText('café')).toBe('cafe')
    expect(normalizeText('mañana')).toBe('manana')
    expect(normalizeText('ñoño')).toBe('nono')
  })

  it('converts to lowercase', () => {
    expect(normalizeText('HELLO')).toBe('hello')
    expect(normalizeText('Hello World')).toBe('hello world')
  })

  it('preserves empty string', () => {
    expect(normalizeText('')).toBe('')
  })

  it('handles strings without accents', () => {
    expect(normalizeText('product name')).toBe('product name')
    expect(normalizeText('ABC123')).toBe('abc123')
  })
})
