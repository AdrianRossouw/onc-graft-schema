Graft.JSV = require('JSV').JSV;

/**
* Schema model definition.
*
* This model that represents a JSON schema representation of data model.
*/
module.exports = this.model = Graft.BaseModel.extend({
    urlRoot: '/api/Schema',
    defaults: {
        type: 'object',
        properties: {}
    },
    initialize: function(attr) {
        this.$schema = this.loadSchema();
    },
    /**
     * We use this function to turn the initialize method into a
     * deferred call.
     */
    isLoaded: function() {
        return _.when(this.$schema)
            .then(_.f.functionize(this));
    },
    /**
     * Load the schema into the JSV environment.
     *
     * This triggers a fetch, so we wrap it in a promise
     * so it can be checked asynchronously.
     */
    loadSchema: function() {
        var defer = _.Deferred();

        // We resolveWith and rejectWith here so that the events will always
        // be bound with the schema model set.
        var doneFn = _.bind(function(m) {
            defer.resolveWith(this, [this.env().createSchema(m.toJSON())]);
        }, this);

        var failFn = _.bind(function(m) {
            defer.rejectWith(this, _(arguments).toArray());
        }, this);

        this.fetch().done(doneFn).fail(failFn);

        return defer.promise();
    },
    /**
    * Validate an object against the schema.
    *
     */
    validateModel: function(model) {
        return $.when(this.$schema).then(function(schema) {
            var report = schema.validate(model.toJSON());
            return report.errors;
        });
    },
    /**
    * JSV validation environment.
    *
    * We memoize this to make sure we only set up one environment, and then re-use it.
    */
    env: _.memoize(function() {
        var env = Graft.JSV.createEnvironment('json-schema-draft-03');
        env.setOption('defaultSchemaURI', 'http://json-schema.org/hyper-schema#');
        env.setOption('latestJSONSchemaSchemaURI', 'http://json-schema.org/schema#');
        env.setOption('latestJSONSchemaHyperSchemaURI', 'http://json-schema.org/hyper-schema#');
        env.setOption('latestJSONSchemaLinksURI', 'http://json-schema.org/links#');
        return env;
    })
});
