const express = require('express');
const {v4: uuidv4} = require("uuid");

const Logger = require('../../lib/logger');
const generateJWT = require("../../lib/generateJWT");
const {BadRequest} = require("../../lib/errors");

const log = new Logger({ label: 'routes/auth/implicitFlow' });
const router = express.Router();

router.post('/', token);
router.get('/', tokenRedirect);

module.exports = router

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
 * @param {Function} res.setHeader
 */
async function token (req, res) {
    log.info('token requested')
    let token = await generateJWT(req.body?.payload, req.body?.ttl)
    res.setHeader('content-type', 'text/plain').status(200).send(token)
}

/**
 * The Redirect flow is used for the non-embedded window
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
    if (!req.query.redirect_uri) throw new BadRequest('redirect_uri param required')

    let redirect = new URL(req.query.redirect_uri)
      ,params = new URLSearchParams(redirect.search)
      ,windowConfig;

    // OAuth 2 RFC version of auth connector - window configuration is in the "state" parameter
    // "state" parameter must be added to the redirect_uri
    if (req.query.response_type === 'code') throw new BadRequest('code redirect requested at token redirect endpoint')
    else if (req.query.response_type === 'id_token') {
        params.append('state', req.query.state);
        windowConfig = JSON.parse(req.query.state)?.['lpUnifiedWindowConfig'];

    // openID version of auth connector - window config is already in redirect_uri
    } else {
        log.warn(`old auth connector version`)
        windowConfig = JSON.parse(redirect.searchParams.get('lpUnifiedWindowConfig'));
    }

    // try to set the sub to the vid from the window config
    let sub = windowConfig?.['engConf']?.['svid']

    let payload = { sub };
    let token = await generateJWT(payload)
    params.append('token', token);
    redirect.search = params.toString();
    res.redirect(redirect.href);
}
