let activeRequests = 0
let listeners = []

const notify = () => {
  const isLoading = activeRequests > 0
  listeners.forEach(cb => cb(isLoading))
}

export const globalLoading = {
  subscribe(cb) {
    listeners.push(cb)
    return () => {
      listeners = listeners.filter(fn => fn !== cb)
    }
  },
  start() {
    activeRequests++
    notify()
  },
  stop() {
    activeRequests = Math.max(0, activeRequests - 1)
    notify()
  }
}
