import 'dotenv/config';
import { getConnection } from './db';
import { BrandModel, brandSchema } from './schemas/brands.schema';

async function main(): Promise<void> {
  try {
    await getConnection();

    const data = await BrandModel.find({$nor : [brandSchema]})
    
    console.log({data})
  } catch (error) {
    console.log({ error });
  }
}

main();
