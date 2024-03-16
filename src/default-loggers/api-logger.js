const { axios } = require('axios')

const APILogger = ({
  enableTelemetryMessages = false,
  telemetryEndpointUrl,
}) => {
  const fetcher = axios.create({
    baseURL: telemetryEndpointUrl,
  })

  const log = (chunk = []) => {
    if (chunk.length === 0 || !baseUrl) {
      return
    }

    enableTelemetryMessages &&
      console.info(`Sending chunk to the API 📦. Size of the chunk: ${chunk.length}`)

    fetcher.post('/', {
      logs: chunk,
    })
  }

  return {
    log,
  }
}

module.exports = APILogger
