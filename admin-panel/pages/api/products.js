import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  const { method } = req;
  await isAdminRequest(req, res);

  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    const { title, description, price, images, category, properties } = req.body;
    const productDocument = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
    });
    res.json(productDocument);
  }

  if (method === "PUT") {
    const { title, description, price, images,category, properties, _id } = req.body;
    await Product.updateOne({ _id }, { title, description, price, images, category,properties });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
