import { createApp } from './app.js';
import { assertEnv, env } from './config/env.js';
import { connectDb } from './config/db.js';

assertEnv();

const app = createApp();

connectDb(env.mongoUri)
  .then(() => {
    app.listen(env.port, () => {
      console.log(`AgroVision API listening on port ${env.port}`);
    });
  })
  .catch((error) => {
    console.error('Could not connect to MongoDB.');
    console.error(error.message);
    process.exit(1);
  });
