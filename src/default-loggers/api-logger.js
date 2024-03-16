const axios = require('axios')

const APILogger = ({
  enableTelemetryMessages = false,
  telemetryEndpointUrl,
}) => {
  const fetcher = axios.create({
    baseURL: telemetryEndpointUrl,
  })

  const log = (chunk = []) => {
    if (chunk.length === 0) {
      return
    }

    if (!telemetryEndpointUrl) {
      console.warn('💤 Telemetry endpoint URL is not defined. Skipping sending logs to remote API')
      return
    }

    enableTelemetryMessages &&
      console.info(`Sending chunk to the API 📦. Size of the chunk: ${chunk.length}`)

    fetcher.post('/', {
      logs: chunk,
    })
    .catch((error) => { // handle async errors
      console.error('❌ Error while sending logs to remote API', error.errors)
    })
  }

  return {
    log,
  }
}

module.exports = APILogger
