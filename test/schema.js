/*jshint unused:false*/
var should   = require('should');
var _ = require('underscore');
var testPort = 8905;

// Initialize the Graft application object.
var Graft = require('graftjs/server');
var Backbone = require('backbone');

var TestBaseModel = Backbone.Model.extend({
    title: 'TestBaseModel'
});
Graft.BaseModel = TestBaseModel;

Graft.on('test:setup', function(port) {
    // A simple test data adaptor to debug the REST api.
    var Mock = require('graft-mockdb');

    Mock.testData.Schema = [];
    Mock.testData.Schema.push(require('./fixture/resources/Schema.Account.json'));

    Graft.load(__dirname + '/../');
    Graft.load(__dirname + '/fixture/');
    Graft.start({ port: port });
});

describe('Schema Validation', function() {
    before(function() {
        Graft.trigger('test:setup', testPort);
    });

    describe('Basic model functionality', function() {
        before(function() {
            this.schema = new Graft.$models.Schema({id: 'Account'});
        });
        it('Should have created Graft.tv4', function() {
            Graft.should.have.property('tv4');
        });
        it('Should have working tv4.env()', function() {
            var env = Graft.$models.Schema.prototype.env();

            var report = env.validateMultiple({ a : 1 }, {
                type : 'object',
                properties : { a : { type : 'string' }}
            });

            report.errors.should.have.length(1);
        });
        it('Should be possible to create a schema model', function() {
            should.exist(this.schema);
        });
        it('Should make use of Graft.BaseModel', function() {
            this.schema.should.be.an.instanceOf(TestBaseModel);
        });
        it('Should be able to load a schema definition', function(done) {
            this.schema.$schema
                .then(function() {done();}, done);
        });
    });

    describe('Basic validation', function() {
        before(function(done) {
            this.schema = new Graft.$models.Schema({id: 'Account'});

            this.instance = new Graft.$models.Account({
                id: 'Susan',
                status: 'offline',
                group: 'default'
            });

            _.when(this.schema.isLoaded()).then(function() {done();});
        });
        it('will validate a model', function(done) {
            this.schema.validateModel(this.instance)
                .then(function(result) { result.should.have.length(0); done(); }, done);
        });
        it('will trigger an error', function(done) {
            this.instance.unset('group'); // required field;
            this.schema.validateModel(this.instance)
                .then(function(result) { result.should.have.length(1); done(); }, done);
        });
    });
});
