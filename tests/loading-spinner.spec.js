import { describe, it, expect, beforeEach } from 'vitest'
import { removeSpinner } from '../src/utils/loading-spinner'

describe('removeSpinner', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('removes the loading spinner element from the DOM', () => {
    document.body.innerHTML = `
      <div id="app">
        <div class="loading-spinner">
          <div class="loading-spinner__ring"></div>
          <p class="loading-spinner__text">Cargando...</p>
        </div>
      </div>
    `

    removeSpinner()

    expect(document.querySelector('#app .loading-spinner')).toBeNull()
  })

  it('keeps other children of #app intact', () => {
    document.body.innerHTML = `
      <div id="app">
        <div class="loading-spinner">
          <div class="loading-spinner__ring"></div>
          <p class="loading-spinner__text">Cargando...</p>
        </div>
        <div class="app-content">Main app</div>
      </div>
    `

    removeSpinner()

    expect(document.querySelector('#app .loading-spinner')).toBeNull()
    expect(document.querySelector('#app .app-content')).not.toBeNull()
    expect(document.querySelector('#app .app-content').textContent).toBe('Main app')
  })

  it('does nothing when no spinner exists', () => {
    document.body.innerHTML = `
      <div id="app">
        <div class="app-content">Main app</div>
      </div>
    `

    removeSpinner()

    expect(document.querySelector('#app .app-content')).not.toBeNull()
  })

  it('does nothing when #app is empty', () => {
    document.body.innerHTML = '<div id="app"></div>'

    removeSpinner()

    expect(document.querySelector('#app')).not.toBeNull()
    expect(document.querySelector('#app').children.length).toBe(0)
  })
})
