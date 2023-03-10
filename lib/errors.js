/**
 * @class BadRequest
 * @extends Error
 * @property {Number} statusCode
 */
class BadRequest extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}

module.exports = {BadRequest};