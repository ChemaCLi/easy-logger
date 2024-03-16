const axios = require('axios')

const APILogger = () => {
  const baseUrl = process.env.REMOTE_LOGS_API_URL

  const fetcher = axios.create({
    baseURL: baseUrl,
  })

  const log = (data) => {
    if (!baseUrl) return;
    fetcher.post('/logs', data).catch(console.error)
  }

  return {
    log,
  }
}

module.exports = APILogger
