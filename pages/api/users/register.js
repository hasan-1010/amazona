// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import nc from "next-connect"
import User from "../../../models/User";
import db from "../../../utils/db";
import bcrypt from 'bcryptjs';
import { signToken } from "../../../utils/auth";

const handler = nc();

handler.post(async(req, res) => {
    await db.connect();
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password),
        isAdmin: false
    })
    try{
        const user = await newUser.save();
        await db.disconnect();
        const token = signToken(user);
        res.send({
            token, 
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    }
    catch(err){
        console.log(err);
        await db.disconnect();
        if(err.code == 11000) {
            res.status(401).json({status: err.code, message: err.message})
        }else{
            res.status(err.status).json({status: err.status, message: err.message})
        }
    }
     
})

export default handler;