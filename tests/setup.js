// Polyfill ResizeObserver for jsdom (required by Vuetify)
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock
