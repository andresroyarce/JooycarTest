var assert = require('assert');
const supertest = require('supertest');
const { app, dbMongo, schemas } = require('../app');
const { trip1, trip2, readings, resultsResponse } = require('./mockdata');
const status = require('http-status');

const database = process.env.DB_TEST_PATH + ':' + process.env.DB_TEST_PORT + '/' + process.env.DB_TEST_TABLE;

const handleError = function (err) {
  console.log(err);
};

describe('API Test for Jooycar', function () {
  let connection;
  let db;
  let server;
  let mockTrip1;
  let mockTrip2;

  beforeAll(async function () {
    // runs once before the first test in this block
    server = app.listen(process.env.API_PORT, () => {
      console.log(`Jooycar API Test listening in port: ${process.env.API_PORT}`);
      });
    db = await dbMongo.connect(database, {}, () => console.log('Db Mongo creada.'));

    mockTrip1 = new schemas.trip(trip1);
    mockTrip2 = new schemas.trip(trip2);

    await mockTrip1.save();
    await mockTrip2.save();
  });

  afterAll(async function () {
    await schemas.trip.deleteOne( { _id: mockTrip1._id } ).then( function (err, data) {
      if (err) return handleError(err);
      // deleted at most one tank document
      console.log('Borrado de datos de prueba.');
      console.log(data);
    });

    await schemas.trip.deleteOne( { _id: mockTrip2._id } ).then( function (err, data) {
      if (err) return handleError(err);
      // deleted at most one tank document
      console.log('Borrado de datos de prueba.');
      console.log(data);
    });

    await schemas.trip.deleteMany( {} ).then( function (err, data) {
      if (err) return handleError(err);
      // deleted at most one tank document
      console.log('Borrado de datos de prueba.');
      console.log(data);
    });


    // runs once after the last test in this block
    await server.close();
    await dbMongo.connection.close();

    
  });

    describe('Test GET Endpoints', () => {
      it('should return all results when no filters are used', async () => {
        await supertest(server)
          .get(process.env.API_PATH)
          .expect(status.OK)
          .then( (response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(2);
            expect(response.body[0]).toHaveProperty('_id');
            expect(response.body[0]).toMatchObject( trip1 );
            expect(response.body[1]).toMatchObject( trip2 );

          });          
      });
      it('should return no results when limit is set to zero for query', async () => {
        await supertest(server)
          .get(process.env.API_PATH)
          .query({
            limit: 0
           })
          .expect(status.OK)
          .then( (response) => {
            expect(response.body.length).toEqual(0);
          });          
      });
      it('should return error when offset is set wrong', async () => {
        await supertest(server)
          .get(process.env.API_PATH)
          .expect(status.REQUESTED_RANGE_NOT_SATISFIABLE)
          .query({
            offset: 3
           })
          .then( (response) => {
            expect(response.body.errorCode).toEqual(22);
          });          
      });
      it('should return OK when use offset and limits', async () => {
        await supertest(server)
          .get(process.env.API_PATH)
          .expect(status.OK)
          .query({
            offset: 1,
            limit: 1
           })
          .then( (response) => {
            expect(response.body.length).toEqual(1);
            expect(response.body[0]).toMatchObject( trip2 );
          });          
      });
      it('should filter by gte start time', async () => {
        await supertest(server)
          .get(process.env.API_PATH)
          .expect(status.OK)
          .query({
            start_gte: 1643738400000
           })
          .then( (response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(1);
            expect(response.body[0]).toHaveProperty('_id');
            expect(response.body[0]).toMatchObject( trip2 );
          });          
      });
      it('should filter by lte start time', async () => {
        await supertest(server)
          .get(process.env.API_PATH)
          .expect(status.OK)
          .query({
            start_lte: 1643738400000
           })
          .then( (response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(1);
            expect(response.body[0]).toHaveProperty('_id');
            expect(response.body[0]).toMatchObject( trip1 );
          });          
      });
      it('should filter with no results', async () => {
        await supertest(server)
          .get(process.env.API_PATH)
          .expect(status.OK)
          .query({
            start_lte: 0
           })
          .then( (response) => {
            expect(response.body.errorCode).toEqual(22);
          });          
      });      
      it('should filter by distance', async () => {
        await supertest(server)
          .get(process.env.API_PATH)
          .expect(status.OK)
          .query({
            distance_gte: 30
           })
          .then( (response) => {
            expect(Array.isArray(response.body)).toBeTruthy();
            expect(response.body.length).toEqual(1);
            expect(response.body[0]).toHaveProperty('_id');
            expect(response.body[0]).toMatchObject( trip2 );
          });          
      });
    });

    describe('Test POST Endpoints', () => {
      it('should create a new post', async () => {
       await supertest(server)
          .post(process.env.API_PATH)
          .expect(status.OK)
          .send(
            readings
          )
        .then( (response) => {
          expect(response.body).toMatchObject( resultsResponse );

        });        
      });

      it('should result error when time missing in the readings', async () => {
        let readingsMock = Object.assign({}, readings);
        delete readingsMock.readings[0].time;

        await supertest(server)
           .post(process.env.API_PATH)
           .expect(status.PRECONDITION_FAILED)
           .send(
             readingsMock
           )
         .then( (response) => {
           expect(response.body.errorCode).toEqual(28);
         });        
      });

      it('should return error when readings are less then five', async () => {
        let readingsMock = Object.assign({}, readings);
        readingsMock.readings.pop();

        await supertest(server)
           .post(process.env.API_PATH)
           .expect(status.BAD_REQUEST)
           .send(
            readingsMock
           )
         .then( (response) => {
           expect(response.body.errorCode).toEqual(22);
         });        
       });

    });

});

