import { exec } from "node:child_process";

import util from "node:util";

const execAync = util.promisify(exec);

type ExecInputs = {
  databaseName: string;
  collectionName: string;
  filePath: string;
  username: string;
  password: string;
};

export default async function exportFile({
  databaseName,
  collectionName,
  filePath,
  username,
  password,
}: ExecInputs) {
  const command = `mongoexport ${process.env.DATABASE_SHELL_URL} --db ${databaseName} --collection ${collectionName}  --out ${filePath} --username ${username} --password ${password} --jsonArray `;
  try {
    console.log({ command });
    const { stderr, stdout } = await execAync(command);
    return { stderr, stdout };
  } catch (error) {
    return error;
  }
}
