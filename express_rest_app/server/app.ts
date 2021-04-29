import path from 'path';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import feedRoutes from './routes/feed';

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//
//   next();
// });
app.use(cors());

app.use('/feed', feedRoutes);

app.listen(PORT, () => {
  console.log(`\napp listening at http://localhost:${PORT}\n`);
});
