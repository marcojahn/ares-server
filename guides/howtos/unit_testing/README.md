# Unit Testing

For unit tests the following libraries are used.

- Mocha (testframework)
- SinonJS (spies and stubs)
- Chai (?)

An example Mocha unit test

    var assert = require("assert")
    describe('Array', function(){
      describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
          assert.equal(-1, [1,2,3].indexOf(5));
          assert.equal(-1, [1,2,3].indexOf(0));
        })
      })
    })