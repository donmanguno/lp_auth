'use strict';

const express = require('express');

const packageJson = require('../package.json');
const Logger = require('../lib/logger');

const router = express.Router();
const log = new Logger('routes/admin');

router.get('/', (req, res) => {
    log.info('application info requested');
    res.status(200).send({
        name: packageJson.name,
        version: packageJson.version
    })
});

module.exports = router;