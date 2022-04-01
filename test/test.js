var assert = require('assert');

// Passing arrow functions (aka “lambdas”) to Mocha is discouraged. Lambdas lexically bind this and cannot access the Mocha context. 

describe('hooks', function () {
   /*  before(function () {
        // runs once before the first test in this block
    });

    after(function () {
        // runs once after the last test in this block
    });


    beforeEach("alguna descripcion", function funname() {
        // runs before each test in this block
        // return db.clear().then(function () {
        //    return db.save([tobi, loki, jane]);
        // });
    });

    afterEach(function () {
        // runs after each test in this block
    }); */

    // test cases
    describe('Array', function () {
        describe('#indexOf()', function () {
            it('should return -1 when the value is not present', function () {
                assert.equal([1, 2, 3].indexOf(4), -1);
            });
        });
    });

    describe('User', function () {
        describe('#save()', function () {
            // pending test below
            it('should save without error', function (done) {
                var user = { name: "Andy", apellido: "Oyarce" };
                if (user.name === "Andy") {
                    done();
                } else {
                    done("Usuario no existe");
                };
            });
        });
    });


    describe.skip('#find()', function () {
        // pending test below
        it('respond with matching records', function () {
            return db.find({ type: 'User' }).should.eventually.have.length(3);
        });
    });
});

/* 
describe('Connection', function () {
    var db = new Connection(),
      tobi = new User('tobi'),
      loki = new User('loki'),
      jane = new User('jane');
  
    beforeEach(function (done) {
      db.clear(function (err) {
        if (err) return done(err);
        db.save([tobi, loki, jane], done);
      });
    });
  
    describe('#find()', function () {
      // pending test below
      it('respond with matching records', function (done) {
        db.find({type: 'User'}, function (err, res) {
          if (err) return done(err);
          res.should.have.length(3);
          done();
        });
      });
    });
  }); 

  describe('a suite of tests', function () {
  this.timeout(500);

  it('should take less than 500ms', function (done) {
    setTimeout(done, 300);
  });

  it('should take less than 500ms as well', function (done) {
    setTimeout(done, 250);
  });
});

*/
  
