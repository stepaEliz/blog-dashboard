import { ref } from 'vue'

export const useToastStore = () => {
  const toasts = useState('toasts', () => [])
  const add = ({ message, type = 'info', duration }) => {
    const id = Date.now().toString()
    toasts.value.push({ id, message, type, duration })
    // automatic delete from array, when DOM is ready
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration || 3000)
  }
  return { toasts, add }
}

export const useToast = () => {
  const { add } = useToastStore()
  return {
    success: (msg, duration) => add({ message: msg, type: 'success', duration }),
    error:   (msg, duration) => add({ message: msg, type: 'error',   duration }),
    info:    (msg, duration) => add({ message: msg, type: 'info',    duration }),
  }
}
