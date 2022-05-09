import express from 'express';
import cors from 'cors';

import authRouter from './routers/authRouter.js';
import accountRouter from './routers/accountRouter.js';

const app = express();
app.use(cors());
app.use(express.json());


app.use(authRouter);
app.use(accountRouter);


app.listen(5050);