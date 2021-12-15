// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import nc from "next-connect"
import Product from "../../models/Product";
import db from "../../utils/db";
import data from '../../utils/data'
import User from "../../models/User";

const handler = nc();

handler.get(async(rec, res) => {
    await db.connect();
    User.deleteMany();
    User.insertMany(data.users);
    Product.deleteMany();
    Product.insertMany(data.products);
    await db.disconnect();
    res.send({message: 'seeded successfully'});
})

export default handler;