import "dotenv/config";

import { BrandModel, brandSchema } from "../schemas/brands.schema";
import { getConnection } from "../db";

import fs from "fs";

const CURSOR = 5;
async function run() {
  await getConnection();
  const docsLength = await BrandModel.countDocuments({});
  const iteration = Math.floor(docsLength) / CURSOR;

  const columnsSet = new Set<string>();
  for (let i = 0; i < iteration; i++) {
    const docs = await BrandModel.find()
      .select({ _id: false, createdAt: false, updatedAt: false, _v: false })
      .skip(i * CURSOR)
      .limit(CURSOR);
    docs.forEach((doc) => {
      const keys = Object.keys(doc.toJSON());
      keys.forEach((key) => {
        const columns = Object.keys(brandSchema.obj);
        if (!columns.includes(key)) {
          columnsSet.add(key);
        }
      });
    });
  }

  const dumbFile = fs.createWriteStream("columns.csv");

  columnsSet.forEach((column) => {
    dumbFile.write(`${column},\n`);
  });

  dumbFile.close(() => {
    console.log("File written");
  });

  process.exit(0);
}

run();
