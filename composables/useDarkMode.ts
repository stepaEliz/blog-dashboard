export const useDarkMode = () => {
  const dark = useState('darkMode', () => false)

  const toggle = () => {
    dark.value = !dark.value

    if (process.client) {
      localStorage.setItem('darkMode', dark.value ? 'true' : 'false')
      document.documentElement.classList.toggle('dark', dark.value)
    }
  }

  if (process.client) {
    const saved = localStorage.getItem('darkMode')
    if (saved === 'true') {
      dark.value = true
      document.documentElement.classList.add('dark')
    }
  }

  return { dark, toggle }
}
