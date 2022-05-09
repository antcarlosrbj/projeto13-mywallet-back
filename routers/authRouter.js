import express from 'express';
import {signUp, loginToken, loginEmail} from './../controllers/authController.js'


const authRouter = express.Router();

authRouter.post("/sign-up", signUp);
authRouter.get("/login", loginToken);
authRouter.post("/login", loginEmail);

export default authRouter;