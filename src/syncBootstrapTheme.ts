/** Syncs Bootstrap color mode with prefers-color-scheme (see spec migrate-css-to-bootstrap ST-1). */
export function syncBootstrapTheme(): void {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const apply = () => {
    document.documentElement.setAttribute(
      'data-bs-theme',
      media.matches ? 'dark' : 'light',
    )
  }
  apply()
  media.addEventListener('change', apply)
}
