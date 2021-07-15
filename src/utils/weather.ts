export const getWeather = (weather: string) => {
  let weatherStr = ''
  if (weather.includes('雪')) {
    weatherStr = 'xue'
  } else if (weather.includes('雨')) {
    weatherStr = 'yu'
  } else if (weather.includes('阴')) {
    weatherStr = 'yin'
  } else if (weather.includes('多云')) {
    weatherStr = 'duoyun'
  } else if (weather.includes('晴')) {
    weatherStr = 'qing'
  }
  return weatherStr
}
