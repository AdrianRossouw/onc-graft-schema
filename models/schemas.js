/**
 * Provides a list of all the possible schemas in the system.
 */
module.exports = this.model = Graft.BaseCollection.extend({
    model: Graft.$models.Schema,
    url: '/api/Schema'
});

this.model.augment({
    fetch: function(parent, options) {
        return ($.when(parent.apply(this, [options]))
            .then(_.f.functionize(this)));
    }
});
