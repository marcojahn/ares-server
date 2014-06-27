var auth = require('../../middleware/authentication').auth;
var sinon = require('sinon');
var should = require("should");

describe('authentication middleware', function(){
    var res, next;

    beforeEach(function () {
        res = {
            json: sinon.spy()
        };
        next = sinon.spy();
    });

    describe('anonymous services', function () {
        var reqAnonymous = {
            originalUrl: '/anonymous'
        };
        var reqUser = {
            originalUrl: '/anonymous',
            session: {
                user: true
            }
        };

        it('can be used anonymously', function () {
            auth(reqAnonymous, res, next);
            next.called.should.be.ok;
            res.json.called.should.not.be.ok;
        });
        it('can be used by logged in users', function () {
            auth(reqUser, res, next);
            next.called.should.ok;
            res.json.called.should.not.be.ok;
        });
    });

    describe('secured service', function () {
        var reqAnonymous = {
            originalUrl: '/users'
        };
        var reqUser = {
            originalUrl: '/users',
            session: {
                user: {}
            }
        };

        it('returns an error for anonymous users', function () {
            auth(reqAnonymous, res, next);
            next.called.should.not.be.ok
            res.json.calledWith(666, {success: false, reason: 'not_authenticated'}).should.be.ok;
        });
        it('can be called by a valid user', function () {
            auth(reqUser, res, next);
            next.called.should.be.ok;
            res.json.called.should.not.be.ok;
        });
    });
});