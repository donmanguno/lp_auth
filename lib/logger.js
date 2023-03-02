'use strict';

/**
 * @param  {object} config
 * @param {string} config.label
 * @property {function} silly
 * @property {function} debug
 * @property {function} info
 * @property {function} warn
 * @property {function} error
 */
class Logger {
    constructor(config = { label }) {
        Object.assign(this, config)
        this.logLevel = LEVEL_MAP.indexOf(process.env?.LOGLEVEL || 'INFO')
        this.info(`${LEVEL_MAP[this.logLevel]} logging enabled`, true)
    }

    /**
     * @param string
     */
    silly (string) {
        if (this.logLevel <= LEVEL_MAP.indexOf('SILLY')) return console.debug(`silly: ${new Date().toISOString()} [${this.label}]: ${string}`)
    }

    /**
     * @param string
     */
    debug (string) {
        if (this.logLevel <= LEVEL_MAP.indexOf('DEBUG')) return console.debug(`debug: ${new Date().toISOString()} [${this.label}]: ${string}`)
    }

    /**
     * @param string
     */
    info (string) {
        if (this.logLevel <= LEVEL_MAP.indexOf('INFO')) return console.info(`info: ${new Date().toISOString()} [${this.label}]: ${string}`)
    }

    /**
     * @param string
     */
    warn (string) {
        if (this.logLevel <= LEVEL_MAP.indexOf('WARN')) return console.warn(`warn: ${new Date().toISOString()} [${this.label}]: ${string}`)
    }

    /**
     * @param string
     */
    error (string) {
        if (this.logLevel <= LEVEL_MAP.indexOf('ERROR')) return console.error(`error: ${new Date().toISOString()} [${this.label}]: ${string}`)
    }


}

module.exports = Logger;

const LEVEL_MAP = [
  'SILLY',
  'DEBUG',
  'INFO',
  'WARN',
  'ERROR'
]