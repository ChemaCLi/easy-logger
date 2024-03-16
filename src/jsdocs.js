/**
 * Log function
 * @typedef LogFunction
 * @param {Object} data
 * @param {string} data.message
 * @param {Object} data.data
 * @param {'info' | 'error' | 'dangerous'} data.level
 * @param {Object} data.errorData
 * @param {string} data.microserviceName
 * @param {string} data.host
 * @param {string} data.timestamp
 */

/**
 * Represents a log adapter function
 * @typedef LogAdapter
 * @param {BaseLogData} baseLogData
 * @returns {{ log: LogFunction }}
 
 */

/**
 * Represents a log adapter.
 * @typedef {Object} BaseLogData
 * @property {string} microserviceName
 * @property {string} host
 * @property {string} useDefaultStdOut
 * @property {string} useDefaultRemoteAPI
 * @property {LogAdapter[]} customLogAdapters
 */
