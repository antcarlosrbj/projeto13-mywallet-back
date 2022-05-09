import express from 'express';

import {allTransaction, addTransaction} from './../controllers/accountController.js';
import verifyToken from './../middlewares/verifyTokenMiddleware.js';


const accountRouter = express.Router();

accountRouter.get("/account", verifyToken, allTransaction);
accountRouter.post("/account", verifyToken, addTransaction);

export default accountRouter;