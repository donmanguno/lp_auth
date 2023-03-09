'use strict';
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const fs = require('fs');

const Logger = require('./logger');
const CONFIG = require('../config/config')

const log = new Logger({ label: 'lib/generateJWT' });

let privKey
try {
    privKey = fs.readFileSync(process.env.PRIVATE_KEY, 'utf8')
} catch (e) {
    console.error(e, e.stack)
}

/**
 *
 * @param {JwtJson} payload
 * @param {Number} ttl - ttl in seconds
 * @return {String} Base64-encoded JWT
 */
function generateJWT (payload, ttl = CONFIG.defaultTTL) {
    log.debug('generating jwt')
    log.silly(`provided payload: ${JSON.stringify(payload)}`)
    let nowSec = Math.round(new Date().getTime() / 1000)
    // generate default payload
    let _payload = {
        iss: process.env.HOST,
        iat: nowSec,
        exp: nowSec + ttl,
        sub: Math.random().toString(36).substring(2)
    }
    // merge provided payload with default
    if (payload) _.merge(_payload, payload)
    log.silly(`final payload: ${JSON.stringify(_payload)}`)

    let token = jwt.sign(_payload, privKey, { algorithm: 'RS256'});
    log.debug(`returning token: ${token}`)
    return token;
}

module.exports = generateJWT;
/**
 * @typedef {Object} JwtJson
 * @param {string} [iss]
 * @param {Number} [iat]
 * @param {Number} [exp]
 * @param {string|undefined} [sub]
 * @param {string} [given_name]
 * @param {string} [family_name]
 * @param {string} [email]
 * @param {string} [gender]
 * @param {string} [preferred_username]
 * @param {string} [phone_number]
 * @param {Object} [lp_sdes]
 */