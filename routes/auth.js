'use strict';

const express = require('express');
const NodeCache = require('node-cache');
const { v4: uuidv4 } = require('uuid');

// import utils
const Logger = require('../lib/logger');
const CONFIG = require('../config/config')
const generateJWT = require('../lib/generateJWT');

// import routes
const { configRouter, pubkeyRouter } = require('./auth/config')

const log = new Logger({ label: 'routes/auth' });
const router = express.Router();
// todo: implement max-keys?
const codeCache = new NodeCache({ stdTTL: 3600 })

router.use('/pubkey', pubkeyRouter);
router.use('/config', configRouter);
router.post('/token', token);
router.get('/token', tokenRedirect);
router.post('/code', code);
router.get('/code', codeRedirect);
router.get('/delegate', delegate);
router.get('/delegatedData', delegatedData);

module.exports = router;

// request handlers
function token (req, res) {
    log.info('token requested')
    let defaultTTL = CONFIG.defaultTTL
    // code flow
    if (req.body?.grant_type === 'authorization_code') {
        log.debug('code flow')
        let details = codeCache.get(req.body.code)
        if (details) {
            let token = generateJWT(details.payload, details.ttl)
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
        let token = generateJWT(req.body?.payload, req.body?.ttl)
        if (token) res.status(200).send(token)
        else res.status(404).send('couldnae make token')
    }
}

async function tokenRedirect (req, res) {
    log.info('token redirect requested')
    if (!req.query.redirect_uri) res.status(400).send('redirect_uri param required')
    let redirect = new URL(req.query.redirect_uri)
      ,params = new URLSearchParams(redirect.search)
      ,windowConfig;

    // OAuth 2 RFC version of auth connector - window configuration is in the "state" parameter
    // "state" parameter must be added to the redirect_uri
    if (req.query.response_type === 'id_token') {
        params.append('state',req.query.state);
        windowConfig = JSON.parse(req.query.state).lpUnifiedWindowConfig;
    // openID version of auth connector - window config is already in redirect_uri
    } else {
        log.warn(`old auth connector version`)
        windowConfig = JSON.parse(redirect.searchParams.get('lpUnifiedWindowConfig'));
    }

    let visitInfo, sub, payload;
    // try to get the visit info for this shark session
    // try {
    //     visitInfo = await visitInfoAPI.get(windowConfig.accountId, windowConfig.engConf.svid, windowConfig.engConf.ssid)
    // } catch (e) { log.warn(`windowConfig lacks accountId, svid, or ssid`) }
    //
    // // try to set the sub from the unauth customerId sde
    // try {
    //     sub = visitInfo.appSessions[0].customerInfo.customerInfo.customerId
    // } catch (e) { log.warn('unable to extract customerId from shark session') }

    // if the above failed try to set the sub from the window config
    if (!sub) {
        try {
            sub = windowConfig.engConf.svid
        } catch (e) { log.warn('unable to set sub from vid') }
    }

    // if we have a sub use it
    if (sub) payload = { sub };
    let token = generateJWT(payload)

    params.append('token', token);
    redirect.search = params;
    res.redirect(redirect.href);
}

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

async function codeRedirect (req, res) {
    log.info('code redirect requested')
    if (!req.query.redirect_uri) res.status(400).send('redirect_uri param required')

    let redirect = new URL(req.query.redirect_uri)
      ,params = new URLSearchParams(redirect.search)
      ,windowConfig;

    // OAuth 2 RFC version of auth connector - window configuration is in the "state" parameter
    // "state" parameter must be added to the redirect_uri
    if (req.query.response_type === 'code') {
        params.append('state',req.query.state);
        windowConfig = JSON.parse(req.query.state).lpUnifiedWindowConfig;
        // openID version of auth connector - window config is already in redirect_uri
    } else {
        log.warn(`old auth connector version`)
        windowConfig = JSON.parse(redirect.searchParams.get('lpUnifiedWindowConfig'));
    }

    let visitInfo, sub, payload;
    // try to get the visit info for this shark session
    // try {
    //     visitInfo = await visitInfoAPI.get(windowConfig.accountId, windowConfig.engConf.svid, windowConfig.engConf.ssid)
    // } catch (e) { log.warn(`windowConfig lacks accountId, svid, or ssid`) }
    //
    // // try to set the sub from the unauth customerId sde
    // try {
    //     sub = visitInfo.appSessions[0].customerInfo.customerInfo.customerId
    // } catch (e) { log.warn('unable to extract customerId from shark session') }

    // if the above failed try to set the sub from the window config
    if (!sub) {
        try {
            sub = windowConfig.engConf.svid
        } catch (e) { log.warn('unable to set sub from vid') }
    }

    let code = uuidv4();
    if (code) {
        // if we have a sub use it
        codeCache.set(code, { payload: { sub }})
        params.append('code', code);
        redirect.search = params;
        res.redirect(redirect.href);
    } else {
        res.status(404).send('couldnae make code')
    }
}

async function delegate (req, res) {
    let redirect = new URL(req.query.redirect_uri),
      params = new URLSearchParams(),
      code = uuidv4();

    if (code) {
        codeCache.set(code, {
            payload: {
                iss: 'lp_auth_delegation'
            },
            state: req.query.state,
            scope: req.query.scope
        })
        params.append('code', code);
        params.append('state',req.query.state);
        redirect.search = params;
        res.redirect(redirect);
    } else {
        res.status(404).send('couldnae make code')
    }
}

function delegatedData (req, res) {
    log.debug(`delegation authorization: ${req.headers.authorization}`)
    if (req.headers.authorization === 'Bearer {$botContext.cidp_accessToken}') {
        res.status(401).send();
    } else {
        res.status(200).send('here\'s yer data!')
    }
}