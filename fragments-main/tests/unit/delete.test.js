const request = require('supertest');
const app = require('../../src/app');
describe('DELETE /v1/fragments', () => {
  test('unauthenticated requests are denied', () =>
    request(app).delete('/v1/fragments/random').expect(401));
  test('incorrect credentials are denied', () =>
    request(app).delete('/v1/fragments/random').auth('andjsdsb@email.com', 'jncbccn').expect(401));
  test('if no id found, returns 404 error', async () => {
    const deleted = await request(app)
      .delete('/v1/fragments/random')
      .auth('user1@email.com', 'password1');
    expect(deleted.statusCode).toBe(404);
  });
  test('successful delete with auth returns 200 and GET returns 404', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user2@email.com', 'password2')
      .set('Content-Type', 'text/plain')
      .send('This is fragment');
    const id = JSON.parse(postRes.text).fragment.id;
    const deleted = await request(app)
      .delete(`/v1/fragments/${id}`)
      .auth('user2@email.com', 'password2');
    expect(deleted.statusCode).toBe(200);
    const getRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('user2@email.com', 'password2');
    expect(getRes.statusCode).toBe(404);

    const getfragments = await request(app)
      .get('/v1/fragments')
      .auth('user2@email.com', 'password2');

    expect(getfragments.body.fragments).toEqual([]);
  });
});
