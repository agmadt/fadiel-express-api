process.env.NODE_ENV = 'test';

const expect = require('expect');
const request = require('supertest');
const app = require('./../server');

const userModel = require('../app/models/UserModel');


describe('Endpoint test', function () {
  it('/ should be return 200', (done) => {
    request(app)
      .get('/test')
      .expect(200)
      .end((error) => {
        if (error) throw error;
        done();
      });
  });

  it('POST /test should be return 200', (done) => {
    request(app)
      .post('/test')
      .send({
        name: 'nama'
      })
      .expect(200)
      .end((error) => {
        if (error) throw error;
        done();
      });
  });

  it('/something should be return 404', (done) => {
    request(app)
      .get('/something')
      .expect(404)
      .end(error => {
        if (error) throw error;
        done();
      });
  });
});