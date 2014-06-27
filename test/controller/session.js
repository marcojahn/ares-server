var sessionCtrl = require('../../controller/session');
var sinon = require('sinon');
var should = require("should");

describe('controller session', function () {
    var req = {},
        res = {},
        next = function () {};

    describe ('default route handler', function () {
        it('will respond with http status 400', function () {
            res = {
                send: sinon.spy()
            };

            sessionCtrl.getDefault(req, res, next);

            res.send.calledWith('400', 'METHOD NOT ALLOWED').should.be.ok;
        });
    });
});