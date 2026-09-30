export const green = (message: string): string =>
  `\u001b[32m${message}\u001b[39m`
export const blue = (message: string): string =>
  `\u001b[34m${message}\u001b[39m`
export const grey = (message: string): string =>
  `\u001b[90m${message}\u001b[39m`
// Undim text e.g. used in note() helper
export const bright = (message: string): string =>
  `\u001b[0m${message}\u001b[2m`
