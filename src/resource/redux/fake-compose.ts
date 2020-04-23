export default function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    return <T>(args: T) => args
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)))
}