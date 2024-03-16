## 👩🏻‍💻 How to use
Import the EasyLogger and build an instance object:

```js
const logger = EasyLogger()
```
Then you can use the info, error or dangerous methods as follow:

```js

const repetitiveData = {
  applicationService: 'generatePDFFile',
  ...otherRepetitiveData
}

// This will be attached to every log.
// Keep in mind that this data will be attached to every log, so it's better to keep it small.
// Also, this data will be overwritten by the data you pass in every log call, so be careful with the keys you use.
const log = logger({
  ...repetitiveData
})

log.info({
  message: 'Coverage checking started',
  data: repetitiveData
})

log.info('You can pass a message only for the log.info method') // this will be threated as the message

log.error(new Error('Something went wrong'), {
  message: 'An error occurred',
  data: repetitiveData
})

log.dangerous({
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

If you want to use the default remote API adapter, you need to set the following environment variables:
- REMOTE_LOGS_API_URL

## ⚙️ Custom adapters
The logger is based on adapters. It has 2 default available adapters: 
- StdoutLogAdapter: to print the logs to the console
- RemoteAPIAdapter: to send the logs to a custom HTTPS endpoint

You can also create your own custom adapter. You just need to create a function that returns an object with a log method. The log method will receive the log data and will be executed every time you call the logger methods.

Because the `logData` receive the level, you can use it to decide how to handle the log. For example, you can use the level to filter the logs and send only the error logs to a custom adapter.
```js
const MyCustomAdapter = (config) => {
  const log = (logData) => {
    if (logData.level === 'info') {
      console.table([{
        serviceName: config.serviceName,
        level: logData.level,
        data: logData.data,
        message: logData.message,
        errorData: logData.errorData
      }])
    }

    if (logData.level === 'error') {
      console.error('An error occurred', logData.errorData)
    }
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
| level | `'info'`, `'error'`, `'dangerous'`  | The log level |
| data | object | The data to be logged |
| message | string | The message to be logged |
| errorData | object | The error data to be logged |

