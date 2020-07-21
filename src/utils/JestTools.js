function disableConsoleErrorLocally() {
  spyOn(console, 'error')
}

export { disableConsoleErrorLocally }
