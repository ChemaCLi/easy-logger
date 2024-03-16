const StdOutLogAdapter = require('./default-loggers/stout-logger')
const APILogAdapter = require('./default-loggers/api-logger')

/** @typedef {import('./jsdocs').BaseLogData} */

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

  const info = ({ message, data, ...extraData }) => {
    const payload = buildLogPayload({
      message,
      data: {
        ...extraData,
        ...data,
      },
      level: 'info'
    })
    runLogAdapters(payload)
  }


  const error = (error, args) => {
    const { message, data, ...extraData } = args || {}

    const errorData = {
      name: error.name,
      message: error.message,
      stacktrace: error.stack,
    }

    const payload = buildLogPayload({
      message: message || error.message,
      data: {
        ...extraData,
        ...data,
      },
      level: 'error',
      errorData,
    })

    runLogAdapters(payload) 
  }

  const dangerous = ({ message, data, ...extraData }, error) => {
    const errorData = {}

    if (error) {
      errorData.name = error.name
      errorData.message = error.message
      errorData.stacktrace = error.stack
    }

    const payload = buildLogPayload({
      message,
      data: {
        ...extraData,
        ...data,
      },
      level: 'dangerous',
      errorData,
    })

    runLogAdapters(payload)
  }

  return (repetitiveData) => ({
  /**
   * @param {Object} args
   * @param {string} args.message
   * @param {Object} args.data
   */
    info: (args) => {
      let passedArgs = {
        message: '',
        data: {},
      }

      if (typeof args === 'string') { // if only message string is passed instead of object
        passedArgs.message = args
      } else if (typeof args === 'object') {
        passedArgs = args
      }

      info({ ...repetitiveData, ...passedArgs })
    },
  /**
   * @param {Error} error
   * @param {Object} args
   * @param {string} args.message
   * @param {Object} args.data
   */
    error: (err, args) => {
      let argsToPass = {}
      if (args) {
        argsToPass = args
      }

      error(err, { ...repetitiveData, ...argsToPass })
    },
    /**
     * @param {Object} args
     * @param {string} args.message
     * @param {Object} args.data
     * @param {Error} error
     */
    dangerous: (args, error) => dangerous({ ...repetitiveData, ...args }, error)
  })
}

module.exports = EasyLogger
