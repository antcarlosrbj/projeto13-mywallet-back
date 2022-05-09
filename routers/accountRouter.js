import express from 'express';

import {allTransaction, addTransaction, deleteTransaction} from './../controllers/accountController.js';
import verifyToken from './../middlewares/verifyTokenMiddleware.js';


const accountRouter = express.Router();

accountRouter.get("/account", verifyToken, allTransaction);
accountRouter.post("/account", verifyToken, addTransaction);
accountRouter.delete("/account", verifyToken, deleteTransaction);

export default accountRouter;