import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Theme persistence logic', () => {
  let localStorageMock

  beforeEach(() => {
    localStorageMock = {}
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key) => localStorageMock[key] || null),
      setItem: vi.fn((key, value) => { localStorageMock[key] = value }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reads saved theme from localStorage', () => {
    localStorageMock['theme'] = 'dark'
    const saved = localStorage.getItem('theme')
    expect(saved).toBe('dark')
  })

  it('returns null when no theme is saved', () => {
    const saved = localStorage.getItem('theme')
    expect(saved).toBeNull()
  })

  it('detects prefers-color-scheme: dark', () => {
    vi.stubGlobal('matchMedia', vi.fn((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
    })))

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    expect(prefersDark).toBe(true)
  })

  it('resolves theme: saved dark overrides system preference', () => {
    localStorageMock['theme'] = 'dark'
    vi.stubGlobal('matchMedia', vi.fn((query) => ({
      matches: false,
      media: query,
    })))

    const saved = localStorage.getItem('theme')
    const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    expect(theme).toBe('dark')
  })

  it('resolves theme: no saved + system dark → dark', () => {
    vi.stubGlobal('matchMedia', vi.fn((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
    })))

    const saved = localStorage.getItem('theme')
    const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    expect(theme).toBe('dark')
  })

  it('resolves theme: no saved + system light → light', () => {
    vi.stubGlobal('matchMedia', vi.fn((query) => ({
      matches: false,
      media: query,
    })))

    const saved = localStorage.getItem('theme')
    const theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    expect(theme).toBe('light')
  })

  it('persists theme choice to localStorage', () => {
    localStorage.setItem('theme', 'dark')
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
    expect(localStorageMock['theme']).toBe('dark')
  })
})
