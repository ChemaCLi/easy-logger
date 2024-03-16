const StdOutLogAdapter = require('./default-loggers/stout-logger')
const APILogAdapter = require('./default-loggers/api-logger')

/**
 * @param {BaseLogData} baseLogData
 */
const EasyLogger = ({
  microserviceName = 'microservice-not-specified',
  host = 'host-not-specified',
  useDefaultStdOut = true,
  useDefaultRemoteAPI = false,
  customLogAdapters = [],
}) => {
  const baseLogData = {
    host,
    useDefaultStdOut,
    customLogAdapters,
    microserviceName,
    useDefaultRemoteAPI,
  }

  const logAdapters = [
    ...customLogAdapters.map((constructBuildAdapter) => constructBuildAdapter(baseLogData)),
  ]

  useDefaultStdOut && logAdapters.push(StdOutLogAdapter(baseLogData))
  useDefaultRemoteAPI && logAdapters.push(APILogAdapter(baseLogData))

  const buildLogPayload = ({ message, data, level, errorData }) => ({
    microserviceName,
    host,
    level,
    message,
    data,
    errorData,
    timestamp: new Date().toISOString(),
  })

  const runLogAdapters = (data) => {
    logAdapters.forEach((adapter) => {
      try {
        adapter.log(data)
      } catch (error) {
        console.error('Error while running log adapter', error)
      }
    })
  }

  /**
   * @param {Object} args
   * @param {string} args.message
   * @param {Object} args.data
   */
  const info = ({ message, data }) => {
    const payload = buildLogPayload({ message, data, level: 'info' })
    runLogAdapters(payload)
  }

  /**
   * @param {Error} error
   * @param {Object} args
   * @param {string} args.message
   * @param {Object} args.data
   */
  const error = (error, args) => {
    const { message, data } = args || {}

    const errorData = {
      name: error.name,
      message: error.message,
      stacktrace: error.stack,
    }

    const payload = buildLogPayload({
      message: message || error.message,
      data,
      level: 'error',
      errorData,
    })

    runLogAdapters(payload) 
  }

  /**
   * @param {Object} args
   * @param {string} args.message
   * @param {Object} args.data
   * @param {Error} error
   */
  const dangerous = ({ message, data }, error) => {
    const errorData = {}

    if (error) {
      errorData.name = error.name
      errorData.message = error.message
      errorData.stacktrace = error.stack
    }

    const payload = buildLogPayload({
      message,
      data,
      level: 'dangerous',
      errorData,
    })

    runLogAdapters(payload)
  }

  return {
    info,
    error,
    dangerous,
  }
}

module.exports = EasyLogger
