/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 201);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post("/api/books")
        .send({title: "Crime and Punishment"})
        .end((err, res) => {
          assert.equal(res.status, 201);
          assert.equal(res.body.title, "Crime and Punishment");
          assert.isNotNull(res.body._id);
          id = res.body._id;
          console.log("id has been set to: " + id);
          done();
        })

      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post("/api/books")
        .send({})
        .end((err, res) => 
          {
          assert.equal(res.body, "missing required field title")
          done();
        })
      });
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get("/api/books")
        .end((err, res) => {
          assert.equal(res.status, 201)
          assert.isArray(res.body, "response should be an array")
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        })
      });      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get("/api/books/" + "idthatdoesntexist")
        .end((err, res) => {
          assert.strictEqual(res.body, "no book exists")
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai.request(server)
          .get("/api/books/" + id)
          .end((err, res) => {
            assert.equal(res.status, 201)
            assert.equal(res.body._id, id);
            assert.equal(res.body.title, "Crime and Punishment")
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
          chai.request(server)
          .post("/api/books/" + id)
          .send({comment: "tester"})
          .end((err, res) => {
            assert.isTrue(res.body.comments.includes("tester"));
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post("/api/books/" + id)
        .send({comment: ""})
        .end((err, res) => {
          assert.equal(res.status, 201)
          assert.equal(res.body, "missing required field comment")
          done()
        })      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post("/api/books/" + "idthatdoesn'texist")
        .send({comment: "blah"})
        .end((err, res) => {
          assert.equal(res.status, 500)
          assert.equal(res.body, "no book exists")
          done()
        })      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete("/api/books/" + id)
        .send({ _id: id })
        .end((err, res) => 
          { assert.equal(res.body, "delete successful")
            done();
          })      
        });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete("/api/books/" + id)
        .send({ _id: id })
        .end((err, res) => 
          { assert.equal(res.body, "no book exists")
            done();
          })
      });

    });

  });

});
