const serverless = require('serverless-http');
const express = require('express');

const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const Logger = require("./lib/logger");

const log = new Logger('app');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

// ROUTES
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.listen(3333, () => log.info('listening on 3333'))
// module.exports.handler = serverless(app);