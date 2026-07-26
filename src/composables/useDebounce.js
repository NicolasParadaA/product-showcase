import { ref, watch, onUnmounted, getCurrentInstance } from 'vue'

/**
 * Composable that debounces a reactive source value.
 * @param {Ref} source - The reactive ref to debounce
 * @param {number} delay - Debounce delay in ms (default: 300)
 * @returns {Ref} Debounced ref
 */
export function useDebounce(source, delay = 300) {
  const debounced = ref(source.value)
  let timer = null

  watch(source, (newValue) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = newValue
      timer = null
    }, delay)
  })

  // Only register onUnmounted if inside a component (skip in tests)
  if (getCurrentInstance()) {
    onUnmounted(() => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
    })
  }

  return debounced
}
