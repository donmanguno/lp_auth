'use strict';

/**
 * @param  {object} config
 * @param {string} config.label
 * @property {function} debug
 * @property {function} info
 * @property {function} warn
 */
class Logger {
    constructor(config = { label }) {
        Object.assign(this, config)
    }

    /**
     * @param string
     */
    debug (string) {
        return console.debug(`${new Date().toISOString()} [${this.label}]: ${string}`)
    }

    /**
     * @param string
     */
    info (string) {
        return console.info(`${new Date().toISOString()} [${this.label}]: ${string}`)
    }

    /**
     * @param string
     */
    warn (string) {
        return console.warn(`${new Date().toISOString()} [${this.label}]: ${string}`)
    }


}

module.exports = Logger;