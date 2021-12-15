// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import nc from "next-connect"
import Product from "../../../models/Product";
import db from "../../../utils/db";

const handler = nc();

handler.get(async(rec, res) => {
    await db.connect();
    const products = await Product.find({});
    await db.disconnect();
    res.send(products);
})

export default handler;