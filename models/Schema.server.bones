/**
 * Server side extentions of the Schema model.
 *
 * This extends the Schema model to load JSON schemas from the fixtures
 * directory.
 */
var common = require('../../common');

models.Schema.prototype.sync = common.couchSync('schemas');
