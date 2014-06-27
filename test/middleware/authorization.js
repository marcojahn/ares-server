var authorization = require('../../middleware/authorization');
var sinon = require('sinon');
var should = require("should");

describe('authorization middleware', function () {

    var res, next, authorizationHandler,
        reqGuest = {session: { user: { usergroup: 'guest'}}},
        reqUser = {session: {user: {usergroup: 'user'}}},
        reqAdmin = {session: {user: {usergroup: 'admin'}}};

    describe('level guest', function () {
        beforeEach(function () {
            res = {
                json: sinon.spy()
            };
            next = sinon.spy();

            authorizationHandler = authorization('guest');
        });

        it ('allows guest', function () {
            authorizationHandler(reqGuest, res, next);

            next.called.should.be.ok;
            res.json.called.should.not.be.ok;
        });
        it ('allows user', function () {
            authorizationHandler(reqUser, res, next);

            next.called.should.be.ok;
            res.json.called.should.not.be.ok;
        });
        it ('allows admin', function () {
            authorizationHandler(reqAdmin, res, next);

            next.called.should.be.ok;
            res.json.called.should.not.be.ok;
        });
    });

    describe('level user', function () {
        beforeEach(function () {
            res = {
                json: sinon.spy()
            };
            next = sinon.spy();

            authorizationHandler = authorization('user');
        });

        it ('denies guest', function () {
            authorizationHandler(reqGuest, res, next);

            next.called.should.not.be.ok;
            res.json.calledWith(403, {success: false, reason: 'not_authorized'}).should.be.ok;
        });
        it ('allows user', function () {
            authorizationHandler(reqUser, res, next);

            next.called.should.be.ok;
            res.json.called.should.not.be.ok;
        });
        it ('allows admin', function () {
            authorizationHandler(reqAdmin, res, next);

            next.called.should.be.ok;
            res.json.called.should.not.be.ok;
        });
    });

    describe('level admin', function () {
        beforeEach(function () {
            res = {
                json: sinon.spy()
            };
            next = sinon.spy();

            authorizationHandler = authorization('admin');
        });

        it ('denies guest', function () {
            authorizationHandler(reqGuest, res, next);

            next.called.should.not.be.ok;
            res.json.calledWith(403, {success: false, reason: 'not_authorized'}).should.be.ok;
        });
        it ('denies user', function () {
            authorizationHandler(reqUser, res, next);

            next.called.should.not.be.ok;
            res.json.calledWith(403, {success: false, reason: 'not_authorized'}).should.be.ok;
        });
        it ('allows admin', function () {
            authorizationHandler(reqAdmin, res, next);

            next.called.should.be.ok;
            res.json.called.should.not.be.ok;
        });
    });
});