import 'dotenv/config';
import { getConnection } from './db';
import { BrandModel, brandSchema } from './schemas/brands.schema';
import importFile from './utils/importFile';


async function main(): Promise<void> {
  try {

    await importFile()
    await getConnection();
    const docs = await BrandModel.find()
    //@ts-ignore
    const formattedDocs = docs.reduce<FormattedDocType[]>((acc, currDoc) => {
      const error = currDoc.validateSync()

      if(!error){
        return [...acc , {
          currDoc,
          errorMeta : null
        }]
      }

      const errorEntries = Object.entries(error.errors)

      const errorMeta = errorEntries.reduce(( acc ,  [fieldName,{kind}]) => {
        return {...acc , [fieldName] : kind}
      } , {})

     return [...acc , {
          currDoc,
          errorMeta
      }]
      
     
    } , []);


    console.log({formattedDocs})

    //@ts-ignore
    const invalidDocs = formattedDocs.filter(doc => doc.errorMeta)


    console.log({invalidDoc : invalidDocs[2].errorMeta })
  
    
    process.exit(0)

  } catch (error) {
    console.log({ error });
    process.exit(0)

  }
}

main();
