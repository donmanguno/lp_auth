'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');

// import utils
const Logger = require('../lib/logger');
const CONFIG = require('../config/config')
const generateJWT = require('../lib/generateJWT');

// import routes
const { configRouter, pubkeyRouter } = require('./auth/config')
const delegationRouter = require ('./auth/delegation')

const log = new Logger({ label: 'routes/auth' });
const router = express.Router();
const codeCache = global.codeCache

router.use('/pubkey', pubkeyRouter);
router.use('/config', configRouter);
router.post('/token', token);
router.get('/token', tokenRedirect);
router.post('/code', code);
router.get('/code', codeRedirect);
router.use('/delegate', delegationRouter);

module.exports = router;

// request handlers
/**
 *
 * @param {e.Request} req
 * @param {Object} [req.body]
 * @param {string} [req.body.grant_type]
 * @param {string} [req.body.code]
 * @param {JwtJson} [req.body.payload]
 * @param {Number} [req.body.ttl]
 * @param {e.Response} res
 * @param {Function} res.status
 */
async function token (req, res) {
    log.info('token requested')
    let defaultTTL = CONFIG.defaultTTL
    // code flow
    if (req.body?.grant_type === 'authorization_code') {
        log.debug('code flow')
        let details = codeCache.get(req.body.code)
        if (details) {
            let token = await generateJWT(details.payload, details.ttl)
            if (token) {
                let response = {
                    access_token: token,
                    id_token: token,
                    token_type: 'bearer',
                    expires_in: details.ttl | defaultTTL
                }
                // delegation token requires scope
                if (details.scope) response.scope = details.scope
                res.status(200).send(response);
            }
            else res.status(404).send('couldnae make token')
        } else res.status(404).send('couldnae find code')
    // implicit flow (direct token request from page)
    } else {
        log.debug('implicit flow')
        let token = await generateJWT(req.body?.payload, req.body?.ttl)
        if (token) res.status(200).send(token)
        else res.status(404).send('couldnae make token')
    }
}

/**
 *
 * @param {e.Request} req
 * @param {Object} [req.query]
 * @param {string} [req.query.redirect_uri]
 * @param {string} [req.query.response_type]
 * @param {string} [req.query.state]
 * @param {Number} [req.body.ttl]
 * @param {e.Response} res
 * @param {Function} res.status
 * @param {Function} res.redirect
 */
async function tokenRedirect (req, res) {
    log.info('token redirect requested')
    if (!req.query.redirect_uri) res.status(400).send('redirect_uri param required')

    let redirect = new URL(req.query.redirect_uri)
      ,params = new URLSearchParams(redirect.search)
      ,windowConfig;

    // OAuth 2 RFC version of auth connector - window configuration is in the "state" parameter
    // "state" parameter must be added to the redirect_uri
    if (req.query.response_type === 'id_token') {
        params.append('state', req.query.state);
        windowConfig = JSON.parse(req.query.state)?.['lpUnifiedWindowConfig'];
    // openID version of auth connector - window config is already in redirect_uri
    } else {
        log.warn(`old auth connector version`)
        windowConfig = JSON.parse(redirect.searchParams.get('lpUnifiedWindowConfig'));
    }

    // try to set the sub to the vid from the window config
    let sub = windowConfig?.['engConf']?.['svid']

    // if we have a sub use it
    let payload = { sub };

    let token = generateJWT(payload)

    params.append('token', token);
    redirect.search = params.toString();
    res.redirect(redirect.href);
}

/**
 * Authorization code requested by client device.
 * @param {e.Request} req
 * @param {Object} [req.body]
 * @param {e.Response} res
 * @param {Function} res.status
 */
function code (req, res) {
    log.info('code requested')
    let code = uuidv4();
    if (code) {
        codeCache.set(code, req.body)
        res.status(200).send(code)
    } else {
        res.status(404).send('couldnae make code')
    }
}

/**
 *
 * @param {e.Request} req
 * @param {Object} [req.query]
 * @param {string} [req.query.redirect_uri]
 * @param {string} [req.query.response_type]
 * @param {string} [req.query.state]
 * @param {Number} [req.body.ttl]
 * @param {e.Response} res
 * @param {Function} res.status
 * @param {Function} res.redirect
 */
async function codeRedirect (req, res) {
    log.info('code redirect requested')
    if (!req.query.redirect_uri) res.status(400).send('redirect_uri param required')

    let redirect = new URL(req.query.redirect_uri)
      ,params = new URLSearchParams(redirect.search)
      ,windowConfig;

    // OAuth 2 RFC version of auth connector - window configuration is in the "state" parameter
    // "state" parameter must be added to the redirect_uri
    if (req.query.response_type === 'code') {
        params.append('state', req.query.state);
        windowConfig = JSON.parse(req.query.state)?.['lpUnifiedWindowConfig'];
        // openID version of auth connector - window config is already in redirect_uri
    } else {
        log.warn(`old auth connector version`)
        windowConfig = JSON.parse(redirect.searchParams.get('lpUnifiedWindowConfig'));
    }

    // try to set the sub to the vid from the window config
    let sub = windowConfig?.['engConf']?.['svid']

    // if we have a sub use it
    let payload = { sub };

    let code = uuidv4();
    codeCache.set(code, { payload })

    params.append('code', code);
    redirect.search = params.toString();
    res.redirect(redirect.href);

}