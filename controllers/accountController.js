import db from "./mongo.js";
import joi from 'joi';

export async function allTransaction(req, res) {
    try {
        /* VERIFICAR TOKEN */

        const { authorization } = req.headers;

        const token = authorization?.replace('Bearer ', '');
        if (!token) return res.sendStatus(401);

        const user = await db.collection("users").findOne({token: token});
        if(!user) return res.sendStatus(401);

        /* ENVIAR TRANSAÇÕES */

        const transactions = await db.collection("transactions").find({userID: user._id}).toArray();

        res.send(transactions);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function addTransaction(req, res) {
    try {
        const transaction = req.body

        /* VALIDAÇÃO (JOI) */

        const transactionSchema = joi.object({
            entry: joi.string().required().pattern(new RegExp('^(credit|debit)$')),
            value: joi.number().required().min(0),
            description: joi.string().required()
        });

        const validation = transactionSchema.validate(transaction);

        if (validation.error) {
            res.sendStatus(400);
            return;
        }

        /* VERIFICAR TOKEN */

        const { authorization } = req.headers;

        const token = authorization?.replace('Bearer ', '');
        if (!token) return res.sendStatus(401);

        const user = await db.collection("users").findOne({token: token});
        if(!user) return res.sendStatus(401);

        /* ADICIONAR NO BANCO DE DADOS */

        transaction.userID = user._id;
        await db.collection("transactions").insertOne(transaction);
        res.sendStatus(201);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}