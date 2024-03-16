## 👩🏻‍💻 How to use
Import the EasyLogger and build an instance object:

```js
const logger = EasyLogger()
```
Then you can use the info, error or dangerous methods as follow:

```js

const repetitiveData = {
  ...
}

logger.info({
  message: 'Coverage checking started',
  data: repetitiveData
})

logger.error(new Error('Something went wrong'), {
  message: 'An error occurred',
  data: repetitiveData
})

logger.dangerous({
  message: 'A very problematic error has ocurred',
  data: repetitiveData
}, new Error('Something went wrong'))
```

## 🔧 Config
You can attach some useful and generic metadata in the config.

Also you can disable the default internal log adapters:
```js
const logger = EasyLogger({
  microserviceName: 'PDF-files-generator',
  host: 'MainServer',
  useDefaultStdOut: true,
  useDefaultRemoteAPI: false, 
})
```

## ⚙️ Custom adapters
The logger is based on adapters. It has 2 default available adapters: 
- StdoutLogAdapter: to print the logs to the console
- RemoteAPIAdapter: to send the logs to a custom HTTPS endpoint


```js
const MyCustomAdapter = (config) => {
  const log = (logData) => {
    console.table([{
      serviceName: config.serviceName,
      level: logData.level,
      data: logData.data,
      message: logData.message,
      errorData: logData.errorData
    }])
  }

  return { log }
}

const logger = EasyLogger({
  customLogAdapters: [MyCustomAdapter]
})
```

## 📖 Config options

| Option | Type | Description |
| --- | --- | --- |
| microserviceName | string | The name of the microservice |
| host | string | The host of the microservice |
| useDefaultStdOut | boolean | Enable or disable the default StdoutLogAdapter |
| useDefaultRemoteAPI | boolean | Enable or disable the default RemoteAPIAdapter |
| customLogAdapters | array | An array of custom log adapters. You can use as many as you need and all of them will be executed. |

## 📖 Custom adapter config data options
| Option | Type | Description |
| --- | --- | --- |
| serviceName | string | The name of the microservice |
| level | string | The log level |
| data | object | The data to be logged |
| message | string | The message to be logged |
| errorData | object | The error data to be logged |


## 📖 Custom adapter Log function param options

| Option | Type | Description |
| --- | --- | --- |
| level | string | The log level |
| data | object | The data to be logged |
| message | string | The message to be logged |
| errorData | object | The error data to be logged |

