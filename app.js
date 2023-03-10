const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors')
const NodeCache = require('node-cache');

// GLOBALS
// todo: implement max-keys?
global.codeCache = new NodeCache({ stdTTL: 3600 })

const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const { OIDConfigRouter } = require('./routes/auth/config')
const Logger = require("./lib/logger");

const log = new Logger({ label: 'app' });



/////////////////
// EXPRESS APP //
/////////////////

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
app.listen(port, listeningMessage)

function listeningMessage () {
    let message = `listening on ${process.env.HOST || 'localhost:' + port}
        
        config:
        ${process.env.HOST}/auth/config`;
    message += `
        
        test page links: 
        https://donmanguno.github.io/test-site/?auth-server=${process.env.HOST?.match(/(https?:\/\/)?(.+)/)?.[2]}${process.env.LP_ACCOUNT ? '&account=' + process.env.LP_ACCOUNT : ''}&randomsub
        https://donmanguno.github.io/test-site/?auth-server=${process.env.HOST?.match(/(https?:\/\/)?(.+)/)?.[2]}${process.env.LP_ACCOUNT ? '&account=' + process.env.LP_ACCOUNT : ''}&sub=Mark`
    if (process.env.MMANGUNO_LOCALHOST === 'true') {
        message += `
        https://mmanguno-pro.lpnet.com/test-site/?auth-server=${process.env.HOST?.match(/(https?:\/\/)?(.+)/)?.[2]}${process.env.LP_ACCOUNT ? '&account=' + process.env.LP_ACCOUNT : ''}&randomsub
        https://mmanguno-pro.lpnet.com/test-site/?auth-server=${process.env.HOST?.match(/(https?:\/\/)?(.+)/)?.[2]}${process.env.LP_ACCOUNT ? '&account=' + process.env.LP_ACCOUNT : ''}&sub=Mark`
    }
    log.info(message)
}