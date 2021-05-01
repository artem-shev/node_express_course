import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

require('dotenv').config({
  path: path.resolve(__dirname, '.env.local'),
});

import connectToDb, { URL } from './utils/database';
import errorHandler from './middlewares/error';

import feedRoutes from './routes/feed';

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/server/tmp/uploads', express.static(path.join(__dirname, 'tmp', 'uploads')));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//
//   next();
// });
app.use(cors());

app.use('/feed', feedRoutes);

app.use(errorHandler);

connectToDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\ndb url: ${URL}`);
      console.log(`\napp listening at http://localhost:${PORT}\n`);
    });
  })
  .catch(console.error);
