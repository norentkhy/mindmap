function disableConsoleErrorLocally() {
  spyOn(console, 'error')
}

function disableConsoleErrorWithin(callback) {
  return (...args) => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const value = callback(...args)
    spy.mockRestore()

    return value
  }
}

export { disableConsoleErrorLocally, disableConsoleErrorWithin }
