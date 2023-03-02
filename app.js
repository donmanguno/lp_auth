const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors')

const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');
const Logger = require("./lib/logger");

const log = new Logger({ label: 'app' });
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors())

// ROUTES
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

// LISTEN
let port = process.env.PORT || 3333
app.listen(port, () => log.info(`listening on ${process.env.HOST || 'localhost:' + port }`))