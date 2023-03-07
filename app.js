const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors')

const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const { OIDConfigRouter } = require('./routes/auth/config')
const Logger = require("./lib/logger");

const log = new Logger({ label: 'app' });
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors())

app.use((req, res, next) => {
    log.debug(`${req.method} ${req.path} ${req.method === 'POST' ? JSON.stringify(req.body) : JSON.stringify(req.query)}`);
    next();
});

// ROUTES
app.use('/admin', adminRouter);
app.use('/auth', authRouter);
app.use('/.well-known/openid-configuration', OIDConfigRouter)

// LISTEN
let port = process.env.PORT || 3333
app.listen(port, () => log.info(`listening on ${process.env.HOST || 'localhost:' + port }`))