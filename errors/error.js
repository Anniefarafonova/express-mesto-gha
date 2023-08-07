const httpConstants = require('http2').constants;

const badRequestError = httpConstants.HTTP_STATUS_BAD_REQUEST;
const notFoundError = httpConstants.HTTP_STATUS_NOT_FOUND;
const internalServerError = httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR;

module.exports = {
  badRequestError,
  notFoundError,
  internalServerError,
};
