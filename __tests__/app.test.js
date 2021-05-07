import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  // beforeAll(() => {
  //   execSync('npm run setup-db');
  // });

  let user;

  beforeAll(async () => {
    execSync('npm run recreate-tables');

    const response = await request
      .post('/api/auth/signup')
      .send({
        name: 'Taylor',
        email: 'taylor@me.com',
        password: 'peaches1234',
      });

    expect(response.status).toBe(200);
    user = response.body;
  });

  let cyrax = {
    name: 'Cyrax',
    species: 'Cyborg',
    url: 'https://en.wikipedia.org/wiki/Cyrax#/media/File:Cyrax_mk11.png',
    introduced: 3,
    isNinja: true,
    fightingStyle: 'Ninjutsu',
  };

  let subZero = {
    name: 'Sub-Zero',
    species: 'Human',
    url: 'https://en.wikipedia.org/wiki/Sub-Zero_(Mortal_Kombat)#/media/File:SubZeroMKXrender.png',
    introduced: 1,
    isNinja: true,
    fightingStyle: 'Shotokan',
  };

  let goro = {
    name: 'Goro',
    species: 'Shokan',
    url: 'https://en.wikipedia.org/wiki/Goro_(Mortal_Kombat)#/media/File:Goro_(Mortal_Kombat).png',
    introduced: 1,
    isNinja: false,
    fightingStyle: 'Shokan',
  };

  it('Post cyrax to /api/mortalkombat', async () => {
    cyrax.userId = user.id;
    const response = await request
      .post('/api/mortalkombat')
      .send(cyrax);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: expect.any(Number),
      name: 'Cyrax',
      species: 'Cyborg',
      url: 'https://en.wikipedia.org/wiki/Cyrax#/media/File:Cyrax_mk11.png',
      introduced: 3,
      isNinja: true,
      fightingStyle: 'Ninjutsu',
      userId: 1
    });

    cyrax = response.body;
  });

  const characters = [
    {
      id: expect.any(Number),
      name: 'Cyrax',
      species: 'Cyborg',
      url: 'https://en.wikipedia.org/wiki/Cyrax#/media/File:Cyrax_mk11.png',
      introduced: 3,
      isNinja: true,
      fightingStyle: 'Ninjutsu',
      userId: 1
    },

    {
      id: expect.any(Number),
      name: 'Sub-Zero',
      species: 'Human',
      url: 'https://en.wikipedia.org/wiki/Sub-Zero_(Mortal_Kombat)#/media/File:SubZeroMKXrender.png',
      introduced: 1,
      isNinja: true,
      fightingStyle: 'Shotokan',
      userId: 1
    },

    {
      id: expect.any(Number),
      name: 'Goro',
      species: 'Shokan',
      url: 'https://en.wikipedia.org/wiki/Goro_(Mortal_Kombat)#/media/File:Goro_(Mortal_Kombat).png',
      introduced: 1,
      isNinja: false,
      fightingStyle: 'Shokan',
      userId: 1

    },
  ];

  // If a GET request is made to /api/cats, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data?
  it('GET /api/mortalkombat', async () => {
    // act - make the request
    subZero.userId = user.id;
    goro.userId = user.id;
    const response1 = await request.post('/api/mortalkombat').send(subZero);
    subZero = response1.body;
    const response2 = await request.post('/api/mortalkombat').send(goro);
    goro = response2.body;

    const response = await request.get('/api/mortalkombat');

    // was response OK (200)?
    expect(response.status).toBe(200);

    // did it return the data we expected?
    expect(response.body).toEqual(expect.arrayContaining(characters));

  });

  // If a GET request is made to /api/cats/:id, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data for the cat with that id?
  test('GET /api/mortalkombat/:id', async () => {
    const response = await request.get('/api/mortalkombat/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(characters[1]);
  });


  it('PUT updated mortalKombat to /api/mortalKombat/:id', async () => {
    let expectedCyrax = {
      id: 1,
      name: 'Cyrax',
      species: 'Human',
      url: 'https://en.wikipedia.org/wiki/Cyrax#/media/File:Cyrax_mk11.png',
      introduced: 2,
      isNinja: true,
      fightingStyle: 'Ninjutsu',
      userId: 1
    };

    const newCyrax = {
      id: 1,
      name: 'Cyrax',
      species: 'Human',
      url: 'https://en.wikipedia.org/wiki/Cyrax#/media/File:Cyrax_mk11.png',
      introduced: 2,
      isNinja: true,
      fightingStyle: 'Ninjutsu',
      userId: 1
    };

    const response = await request
      .put(`/api/mortalKombat/${expectedCyrax.id}`)
      .send(newCyrax);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedCyrax);
    expectedCyrax = response.body;

  });

});