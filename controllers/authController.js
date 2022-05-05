import db from "./mongo.js";
import joi from 'joi';
import bcrypt from 'bcrypt';

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
            await db.collection("registers").findOne({ email: user.email })
        ) {
            res.sendStatus(409);
            return;
        }

        /* CRIPTOGRAFAR SENHA */

        user.password = bcrypt.hashSync(user.password, 10);

        /* ADICIONAR NO BANCO DE DADOS */

        await db.collection("registers").insertOne(user)
        res.sendStatus(201);


    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}