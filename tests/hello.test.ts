import request from 'supertest'
import app from './index';

describe('Hello Get Route With Param', () => {
  it('GET /hello/:username should return greeting', async () => {
    const res = await request(app).get('/hello/alex');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("{\"data\":\"Hello alex\"}");
  });
  
})

describe('Hello Get Route', () => {
  it('GET /hello/ should return greeting', async () => {
    const res = await request(app).get('/hello');
    expect(res.status).toBe(200);
    expect(res.text).toBe("{\"data\":\"Hello World\"}");
  });
  
})


describe('Hello post Route', () => {
  it('POST /hello/ should return greeting', async () => {
    const res = await request(app).post('/hello').send({username: 'Prince'});
    expect(res.status).toBe(200);
    expect(res.text).toBe("{\"data\":\"Hello Prince\"}");
  });
  
})