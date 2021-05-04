/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(`          
      CREATE TABLE mortal_kombat (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL,
        species VARCHAR(512) NOT NULL,
        url VARCHAR(1024) NOT NULL,
        introduced INTEGER NOT NULL,
        is_ninja BOOLEAN DEFAULT FALSE,
        fighting_style VARCHAR(512) NOT NULL
      );
    `);

    console.log('create tables complete');
  }
  catch (err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}