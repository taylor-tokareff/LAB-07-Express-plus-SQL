/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => {
  res.send('Mortal Kombat API');
});

// API routes,
app.get('/api/mortalkombat', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  mortal_kombat.id,
              mortal_kombat.name,
              species,
              url,
              introduced,
              is_Ninja as "isNinja",
              fighting_Style as "fightingStyle",
              user_id as "userId"
      FROM    mortal_kombat
      JOIN    users
      ON      mortal_kombat.user_id = users.id
    `);

    // send back the data
    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/mortalkombat/', async (req, res) => {
  try {
    const cyrax = req.body;
    const data = await client.query(
      `INSERT INTO mortal_kombat (name, species, url, introduced, is_ninja, fighting_style, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, species, url, introduced, is_ninja as "isNinja", fighting_style as "fightingStyle", user_id as "userId";`, [cyrax.name, cyrax.species, cyrax.url, cyrax.introduced, cyrax.isNinja, cyrax.fightingStyle, 1]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(200).json({ error: err.message });
  }
});


app.get('/api/mortalkombat/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  mortal_kombat.id,
              mortal_kombat.name,
              species,
              url,
              introduced,
              is_Ninja as "isNinja",
              fighting_Style as "fightingStyle",
              user_id as "userId"
      FROM    mortal_kombat
      JOIN    users
      ON      mortal_kombat.user_id = users.id
      WHERE   mortal_kombat.id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/mortalkombat/:id', async (req, res) => {
  try {
    const characters = req.body;

    const data = await client.query(`
    UPDATE  mortal_kombat 
      SET   name = $1, species = $2, url = $3, 
            introduced = $4, is_Ninja = $5, fighting_Style = $6
    WHERE   id = $7
    RETURNING id, name, species, url, introduced, is_ninja as "isNinja", fighting_style as "fightingStyle", user_id as "userId";
  `, [characters.name, characters.species, characters.url, characters.introduced, characters.isNinja, characters.fightingStyle, req.params.id])
      ;

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/auth/signup', async (req, res) => {
  try {
    const user = req.body;
    const data = await client.query(`
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email; 
      `, [user.name, user.email, user.password]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});




export default app;