/** Schedule state updates outside the synchronous effect body (eslint react-hooks/set-state-in-effect). */
export function deferStateUpdate(update: () => void) {
  queueMicrotask(update);
}
