import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

require('dotenv').config({
  path: path.resolve(__dirname, '.env.local'),
});

import socket from './socket';
import connectToDb, { URL } from './utils/database';
import errorHandler from './middlewares/error';

import feedRoutes from './routes/feed';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

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
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

app.use(errorHandler);

connectToDb()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`\ndb url: ${URL}`);
      console.log(`\napp listening at http://localhost:${PORT}\n`);
    });

    const io = socket.init(server);

    io.on('connection', () => {
      console.log('Server connected');
    });
  })
  .catch(console.error);
