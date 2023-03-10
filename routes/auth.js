'use strict';

const express = require('express');

// import utils
const Logger = require('../lib/logger');

// import routes
const { configRouter, pubkeyRouter } = require('./auth/config')
const delegationRouter = require ('./auth/delegation')
const implicitFlowRouter = require ('./auth/implicitFlow')
const codeFlowRouter = require ('./auth/codeFlow')

const log = new Logger({ label: 'routes/auth' });
const router = express.Router();

router.use('/token', implicitFlowRouter)
router.use('/code', codeFlowRouter);
router.use('/pubkey', pubkeyRouter);
router.use('/config', configRouter);
router.use('/delegate', delegationRouter);

module.exports = router;