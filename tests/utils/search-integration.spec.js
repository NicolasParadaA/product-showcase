import { describe, it, expect } from 'vitest'
import { normalizeText } from '@/utils/search.js'

describe('normalizeText — search integration', () => {
  it('matches product with accents when filter has no accents', () => {
    const productName = 'Café Express'
    const filter = 'cafe'
    expect(normalizeText(productName).includes(normalizeText(filter))).toBe(true)
  })

  it('matches product with no accents when filter has accents', () => {
    const productName = 'Cafe Express'
    const filter = 'café'
    expect(normalizeText(productName).includes(normalizeText(filter))).toBe(true)
  })

  it('does not match unrelated text', () => {
    const productName = 'Café Express'
    const filter = 'latte'
    expect(normalizeText(productName).includes(normalizeText(filter))).toBe(false)
  })

  it('is case-insensitive through normalizeText', () => {
    const productName = 'CAFÉ LÁTEX'
    const filter = 'café'
    expect(normalizeText(productName).includes(normalizeText(filter))).toBe(true)
  })
})
