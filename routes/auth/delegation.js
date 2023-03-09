const fs = require("fs");
const express = require('express');
const {v4: uuidv4} = require("uuid");

const Logger = require('../../lib/logger');

const log = new Logger({ label: 'routes/auth/delegation' });
const router = express.Router();
const codeCache = global.codeCache

router.get('/delegate', delegate);
router.get('/data', delegatedData);

module.exports = router

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