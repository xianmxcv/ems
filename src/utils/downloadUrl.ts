export const setdownloadParams = (args: any) => {
  return Object.entries(args)
    .map((item) => (item[1] ? `${item[0]}=${item[1]}` : undefined))
    .filter((item) => item)
    .join('&')
}
