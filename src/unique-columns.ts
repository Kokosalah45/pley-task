import 'dotenv/config';
import { getConnection } from "./db";
import { BrandModel } from "./schemas/brands.schema";
import importFile from "./utils/importFile";
import fs from 'fs/promises'

const CURSOR = 5;

async function run(){
    await importFile()
    await getConnection();
    const docsLength =await BrandModel.countDocuments({})
    const iteration  =  Math.floor(docsLength) / CURSOR

    const columnsSet = new Set<string>()
    for(let i = 0 ; i < iteration ; i++){
        const docs = await BrandModel.find().skip(i * CURSOR).limit(CURSOR)
        docs.forEach(doc => {
            const keys = Object.keys(doc.toJSON())
            keys.forEach(key => columnsSet.add(key))
        })
    }

    const dumbFile = await fs.open('columns.txt' , 'w')

    columnsSet.forEach(column => {
        dumbFile.write(column + '\n')
    })

    dumbFile.close()


    process.exit(0)
}



run()