/**
 * Provides a list of all the possible schemas in the system.
 */
model = Backbone.Collection.extend({
    model: models.Schema,
    url: '/api/Schema'
});

model.augment({
    fetch: function(parent, options) {
        return ($.when(parent.apply(this, [options]))
            .pipe(_.f.functionize(this)));
    }
});
