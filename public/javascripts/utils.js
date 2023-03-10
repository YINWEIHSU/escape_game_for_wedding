const utils = {
  withGrid(n) {
    return n * 32
  },
  emitEvent(name, detail) {
    const event = new CustomEvent(name, {
      detail
    })
    document.dispatchEvent(event)
  },
  wait(ms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, ms)
    })
  }
}