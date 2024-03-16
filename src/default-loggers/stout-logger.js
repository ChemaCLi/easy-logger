const StdOutLogger = () => {
  const log = (log) => {
    console.log(log)
  }

  return {
    log,
  }
}

module.exports = StdOutLogger
