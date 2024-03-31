import 'dotenv/config';
import { getConnection } from './db';
import { BrandModel, brandSchema } from './schemas/brands.schema';
import importFile from './utils/importFile';

async function main(): Promise<void> {
  try {

    await importFile()
    await getConnection();
    const docs = await BrandModel.find()
    const invalidDocuments = docs.map((doc ) => {
        const err = doc.validateSync()
        console.log({err})
        if(err){
          return {
            doc,
            err : err.errors
          }
        }
        return {
          doc,
          err
        }
    });

    console.log(invalidDocuments)
  } catch (error) {
    console.log({ error });
  }
}

main();
