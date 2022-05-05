import express from 'express';
import cors from 'cors';
import {signUp, loginToken, loginEmail} from './controllers/authController.js'


const app = express();
app.use(cors());
app.use(express.json());


/* --------------------------- CADASTRO --------------------------- */

app.post("/sign-up", signUp);

/* ---------------------------- LOGIN ----------------------------- */

app.get("/login", loginToken);
app.post("/login", loginEmail);

/* ---------------------------------------------------------------- */

app.listen(5000);