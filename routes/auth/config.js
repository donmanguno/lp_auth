const fs = require("fs");
const express = require('express');
const Logger = require('../../lib/logger');

const log = new Logger({ label: 'routes/auth/config' });

let pubKey, pubKeyString
try {
    pubKey = fs.readFileSync(process.env.PUBLIC_KEY, 'utf8')
    pubKeyString = pubKey.replace(/(-{5}[\w\s]+-{5})|\n/g,'')
}
catch (e) { console.error(e, e.stack) }

const OIDConfigRouter = express.Router();
const configRouter = express.Router();
const pubkeyRouter = express.Router();

configRouter.get('/', (req, res) => {
    log.info('full config info requested')

    let response = getConfig(req)
    res.status(200).send(response)
})

OIDConfigRouter.get('/', (req, res) => {
    log.info('oid config requested')

    let response = getOIDConfig()
    res.status(200).send(response)
})

pubkeyRouter.get('/', (req, res) => {
    log.info('pubkey requested')

    if (pubKeyString) res.status(200).send(pubKeyString)
    else res.status(404).send()
})

module.exports = {
    OIDConfigRouter,
    configRouter,
    pubkeyRouter
};

function getConfig (req) {
    let authConfig = {
        implicit: {
            'LE Settings': {
                'Authentication Endpoint': `${process.env.HOST}/auth/token`
            }
        },
        code: {
            'LE Settings': {
                'Authentication Endpoint': `${process.env.HOST}/auth/code`,
                'Token Endpoint': `${process.env.HOST}/auth/token`,
                'Client ID': `${req.query?.account || '[Site ID]'}`,
                'Client Secret': 'Secret'
            }
        }
    }
    if (pubKey) authConfig.both = { 'JWT Public Key': pubKeyString }
    authConfig.oidConfig = getOIDConfig()

    return authConfig;
}

function getOIDConfig() {
    return {
        "issuer": `${process.env.HOST}`,
        "authorization_endpoint": `${process.env.HOST}/auth/code`,
        "token_endpoint": `${process.env.HOST}/auth/token`,
        // "token_endpoint_auth_methods_supported": ["client_secret_basic", "private_key_jwt"],
        // "token_endpoint_auth_signing_alg_values_supported": ["RS256", "ES256"],
        // "userinfo_endpoint":
        //   "https://server.example.com/connect/userinfo",
        // "check_session_iframe":
        //   "https://server.example.com/connect/check_session",
        // "end_session_endpoint":
        //   "https://server.example.com/connect/end_session",
        // "jwks_uri":
        //   "https://server.example.com/jwks.json",
        // "registration_endpoint":
        //   "https://server.example.com/connect/register",
        "scopes_supported": ["openid"],
        "response_types_supported": ["code", "id_token", "code id_token", "token id_token"],
        "acr_values_supported": ["loa1"],
        // "subject_types_supported":
        //   ["public", "pairwise"],
        // "userinfo_signing_alg_values_supported":
        //   ["RS256", "ES256", "HS256"],
        // "userinfo_encryption_alg_values_supported":
        //   ["RSA1_5", "A128KW"],
        // "userinfo_encryption_enc_values_supported":
        //   ["A128CBC-HS256", "A128GCM"],
        // "id_token_signing_alg_values_supported":
        //   ["RS256"],
        // "id_token_encryption_alg_values_supported":
        //   ["RSA1_5", "A128KW"],
        // "id_token_encryption_enc_values_supported":
        //   ["A128CBC-HS256", "A128GCM"],
        // "request_object_signing_alg_values_supported":
        //   ["none", "RS256", "ES256"],
        // "display_values_supported":
        //   ["page", "popup"],
        "claim_types_supported": ["normal"],
        "claims_supported": ["iss", "iat", "exp", "sub", "given_name", "family_name", "email", "gender", "preferred_username", "phone_number", "lp_sdes"],
        "service_documentation": "https://github.com/donmanguno/lp_auth",
        "ui_locales_supported": ["en-US"]
    }
}
