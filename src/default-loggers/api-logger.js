const axios = require('axios')

const APILogger = () => {
  const baseUrl = 'https://heb-logs-api.com'
  const fetcher = axios.create({
    baseURL: baseUrl,
  })

  const log = (data) => {
    fetcher.post('/logs', data).catch(console.error)
  }

  return {
    log,
  }
}

module.exports = APILogger
