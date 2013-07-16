/**
 * Provides a list of all the possible schemas in the system.
 */
module.exports = this.model = Backbone.Collection.extend({
    model: models.Schema,
    url: '/api/Schema'
});

this.model.augment({
    fetch: function(parent, options) {
        return ($.when(parent.apply(this, [options]))
            .pipe(_.f.functionize(this)));
    }
});
