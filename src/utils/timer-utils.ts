export const delay = <D>(data: D, ms: number): Promise<D> => {
  return new Promise(res => {
    setTimeout(() => res(data), ms)
  })
}
export const sleep = (ms: number) => {
  return new Promise(res => {
    setTimeout(res, ms)
  })
}
