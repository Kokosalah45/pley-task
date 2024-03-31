import { exec }from'node:child_process';

import util from 'node:util'

const execAync = util.promisify(exec)


export default async function importFile(){

   try {

    const {stderr , stdout} = await execAync('mongoimport --uri "mongodb+srv://sandbox.obqry3b.mongodb.net/pley" --collection brands --drop --file ~/Downloads/brands.json --username destro45 --password Kmkm561111aeae --jsonArray')
    console.log({stderr , stdout})
    return {stderr , stdout}

   } catch (error) {
        console.log({ERROR : error})
        return error
   }

}



