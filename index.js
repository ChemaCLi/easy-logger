const EasyLogger = require('./src/easy-logger')
module.exports = EasyLogger

const logger = EasyLogger({
  useDefaultRemoteAPI: false,
})

const basicGoldenOrderData = {
  order_reference: '1234',
  customer_reference: '5678',
}

logger.info({
  message: 'Coverage checking started',
  data: basicGoldenOrderData
})

logger.error(new Error('Something went wrong'), {
  message: 'An error occurred',
  data: {
    basicGoldenOrderData,
    ...basicGoldenOrderData
  }
})

logger.dangerous({
  message: 'A dangerous thing happened',
  data: {
    basicGoldenOrderData,
    ...basicGoldenOrderData
  }
}, new Error('Something went wrong'))
