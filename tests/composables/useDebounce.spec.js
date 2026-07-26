import { describe, it, expect, vi, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useDebounce } from '@/composables/useDebounce'

describe('useDebounce', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('should delay the update by the specified delay', async () => {
    vi.useFakeTimers()
    const source = ref('initial')
    const debounced = useDebounce(source, 300)

    expect(debounced.value).toBe('initial')

    source.value = 'updated'
    await nextTick()
    // Before delay, should still be initial
    expect(debounced.value).toBe('initial')

    // After delay, should be updated
    vi.advanceTimersByTime(300)
    await nextTick()
    expect(debounced.value).toBe('updated')
  })

  it('should only emit last value after rapid changes', async () => {
    vi.useFakeTimers()
    const source = ref('a')
    const debounced = useDebounce(source, 300)

    source.value = 'b'
    source.value = 'c'
    source.value = 'd'
    await nextTick()

    // Before delay, still initial
    expect(debounced.value).toBe('a')

    // After delay, should only have the last value
    vi.advanceTimersByTime(300)
    await nextTick()
    expect(debounced.value).toBe('d')
  })

  it('should use default delay of 300ms when not specified', async () => {
    vi.useFakeTimers()
    const source = ref('start')
    const debounced = useDebounce(source)

    source.value = 'end'
    await nextTick()
    vi.advanceTimersByTime(299)
    await nextTick()
    expect(debounced.value).toBe('start')

    vi.advanceTimersByTime(1)
    await nextTick()
    expect(debounced.value).toBe('end')
  })

  it('should return a ref with initial value', () => {
    vi.useFakeTimers()
    const source = ref('test')
    const debounced = useDebounce(source, 100)

    expect(debounced.value).toBe('test')
    expect(() => debounced.value).not.toThrow()
  })
})
