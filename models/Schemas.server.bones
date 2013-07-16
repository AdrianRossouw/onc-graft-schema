/**
 * Server side extentions of the Schemas collection.
 */
var common = require('../../common');

models.Schemas.prototype.sync = common.couchSync('schemas');
