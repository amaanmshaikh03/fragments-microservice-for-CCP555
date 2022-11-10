const request = require('supertest');
const app = require('../../src/app');
describe('GET req for not found resources', () => {
  test('404 error ', () => request(app).get('/no-such-route').expect(404));
});
