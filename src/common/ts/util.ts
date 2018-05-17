export const debounce = (func: () => void, delay: number) => {
  let timer: NodeJS.Timer
  return function(this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
