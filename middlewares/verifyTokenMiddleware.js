import db from "./../controllers/mongo.js";

export default async function verifyToken(req, res, next) {
    try{
        const { authorization } = req.headers;

        const token = authorization?.replace('Bearer ', '');
        if (!token) return res.sendStatus(401);
        
        const user = await db.collection("users").findOne({ token: token });
        if (!user) return res.sendStatus(401);

        res.locals.user = user;
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }

    next();
}