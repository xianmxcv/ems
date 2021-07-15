// 注： 每次修改此文件，需重启服务才能生效
const proxy = require('http-proxy-middleware')

// 代理路径
//const circuit = 'http://192.168.0.77:8102'
const login = 'http://192.168.0.104:8081'
const circuit = 'http://192.168.0.104:8081'

module.exports = (app) => {
  app.use(
    proxy('**/organization/**', {
      target: login,
      changeOrigin: true,
    })
  )
  app.use(
    proxy('**/energy-config/**', {
      target: circuit,
      changeOrigin: true,
    })
  )
  app.use(
    proxy('**/reportEnergy/**', {
      target: login,
      changeOrigin: true,
    })
  )
}
