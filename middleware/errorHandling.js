'use strict';

const errorHandling = (err, req, res, next) => {
    let payload = {
        msg: err.message,
        success: false
    }
    if (process.env.NODE_ENV !== 'PRODUCTION') payload.stack = err.stack
    res
      .status(err.statusCode)
      .json(payload);
};

module.exports = errorHandling