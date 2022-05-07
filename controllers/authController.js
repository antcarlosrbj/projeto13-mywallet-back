import db from "./mongo.js";
import joi from 'joi';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export async function signUp(req, res) {
    try {
        const user = req.body;

        /* VALIDAÇÃO (JOI) */

        const userSchema = joi.object({
            name: joi.string().required(),
            email: joi.string().email().required(),
            password: joi.string().required().min(8)
        });

        const validation = userSchema.validate(user);

        if (validation.error) {
            res.sendStatus(400);
            return;
        }

        /* VERIFICAÇÃO DUPLICIDADE */

        if (
            await db.collection("users").findOne({ email: user.email })
        ) {
            res.sendStatus(409);
            return;
        }

        /* CRIPTOGRAFAR SENHA */

        user.password = bcrypt.hashSync(user.password, 10);

        /* GERAR TOKEN */

        user.token = uuid();

        /* ADICIONAR NO BANCO DE DADOS */

        await db.collection("users").insertOne(user)
        res.sendStatus(201);


    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function loginToken(req, res) {
    try {
        const { authorization } = req.headers;

        const token = authorization?.replace('Bearer ', '');
        if (!token) return res.sendStatus(401);

        const user = await db.collection("users").findOne({token: token});
        if(!user) return res.sendStatus(401);

        delete user.password;
        delete user.token;
        delete user._id;

        res.send(user)

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}


export async function loginEmail(req, res) {
    try {
        const login = req.body;

        /* VALIDAÇÃO (JOI) */

        const userSchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required().min(8)
        });

        const validation = userSchema.validate(login);

        if (validation.error) {
            res.sendStatus(400);
            return;
        }

        /* VERIFICAR NO BANCO DE DADOS */

        const user = await db.collection("users").findOne({email: login.email});
        if (!user) return res.sendStatus(401);
        if(
            !bcrypt.compareSync(login.password, user.password)
        ) {
            return res.sendStatus(401);
        }

        /* ENVIO DOS DADOS */

        delete user.password;
        delete user._id;

        res.send(user)

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}