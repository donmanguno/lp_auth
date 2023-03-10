'use strict';
const _ = require('lodash');
const jose = require('jose')
const fs = require('fs');

const Logger = require('./logger');
const CONFIG = require('../config/config')

const log = new Logger({ label: 'lib/generateJWT' });

// import private key
const alg = 'RS256'
// const enc = 'RSA-OAEP-256'
const privateKeyFile = fs.readFileSync(process.env.PRIVATE_KEY, 'utf8')
const privateKey = jose.importPKCS8(privateKeyFile, alg)
// const lpPublicKey = jose.importPKCS8(CONFIG.lpPublicKey, alg)

module.exports = generateJWT;

/**
 *
 * @param {JwtJson} payload
 * @param {Number} ttl - ttl in seconds
 * @return {String} Base64-encoded JWT
 */
async function generateJWT (payload, ttl = CONFIG.defaultTTL) {
    log.debug('generating jwt')
    log.silly(`provided payload: ${JSON.stringify(payload)}`)

    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader({ alg, typ: 'JWT' })
      .setIssuer(payload.iss || process.env.HOST)
      .setIssuedAt(payload.iat)
      .setExpirationTime(payload.exp || ttl+'s')
      .setSubject(payload.sub || Math.random().toString(36).substring(2))
      .sign(await privateKey)

    log.silly(`final payload: ${JSON.stringify(jose.decodeJwt(jwt))}`)
    log.debug(`returning token: ${jwt}`)
    return jwt
}

/**
 *
 * @param {JwtJson} payload
 * @param {Number} ttl - ttl in seconds
 * @return {String} Base64-encoded JWT
 */
// async function generateJWE (payload, ttl = CONFIG.defaultTTL) {
//     log.debug('generating jwe')
//     log.silly(`provided payload: ${JSON.stringify(payload)}`)
//
//     const jwe = await new jose.EncryptJWT(payload)
//       .setProtectedHeader({ alg, enc })
//       .setIssuer(payload.iss || process.env.HOST)
//       .setIssuedAt(payload.iat)
//       .setExpirationTime(payload.exp || ttl+'s')
//       .setSubject(payload.sub || Math.random().toString(36).substring(2))
//       .sign(await privateKey)
//       .encrypt(lpPublicKey)
//
//     // log.silly(`final payload: ${JSON.stringify(jose.decodeJwt(jwt))}`)
//     // log.debug(`returning token: ${jwt}`)
//     return jwe
// }

/**
 * @typedef {Object} JwtJson
 * @property {string} [iss]
 * @property {Number} [iat]
 * @property {Number} [exp]
 * @property {string|undefined} [sub]
 * @property {string} [given_name]
 * @property {string} [family_name]
 * @property {string} [email]
 * @property {string} [gender]
 * @property {string} [preferred_username]
 * @property {string} [phone_number]
 * @property {Object} [lp_sdes]
 */