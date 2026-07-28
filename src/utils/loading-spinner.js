/**
 * Remove the loading spinner from #app.
 * Called after the Vue app has mounted to dismiss the initial loading state.
 */
export function removeSpinner() {
  document.querySelector('#app .loading-spinner')?.remove()
}
