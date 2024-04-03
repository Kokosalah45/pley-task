import "dotenv/config";
import { getConnection } from "./db";
import { BrandModel, BrandType, BrandTypeKeys, brandSchema } from "./schemas/brands.schema";
import importFile from "./scripts/importFile";
import castOrGetDefault from "./utils/castOrGetDefault";
import { prompt } from "enquirer";
import mongoose from "mongoose";
import Spinnies from "spinnies";
import exportFile from "./scripts/exportFile";

const wrongFieldsMap: Record<BrandTypeKeys, string[]> = {
  brandName: ["brand"],
  yearFounded: ["yearCreated", "yearsFounded"],
  numberOfLocations: ["locations"],
  headquarters: ["hqAddress"],
};

const consilidateRequiredErrors = (
  document: Partial<BrandType>,
  requiredErrors: BrandTypeKeys[]
) => {
  const faultyDocument = JSON.parse(JSON.stringify(document));

  for (const correctFieldName of requiredErrors) {
    const wrongFieldNames = wrongFieldsMap[correctFieldName];

    if (wrongFieldNames.length) {
      let foundFieldName = "" as BrandTypeKeys;
      for (const wrongFieldName of wrongFieldNames) {
        if (wrongFieldName in faultyDocument) {
          foundFieldName = wrongFieldName as BrandTypeKeys;
          break;
        }
      }
      if (foundFieldName) {
        faultyDocument[correctFieldName] = castOrGetDefault(
          correctFieldName,
          brandSchema,
          faultyDocument[foundFieldName]
        );
      } else {
        faultyDocument[correctFieldName] = castOrGetDefault(correctFieldName, brandSchema);
      }
    } else {
      faultyDocument[correctFieldName] = castOrGetDefault(correctFieldName, brandSchema);
    }
  }

  return faultyDocument;
};

async function main(): Promise<void> {
  try {
    const response = await prompt<{
      collectionName: string;
      importFilePath: string;
      exportFilePath: string;
      username: string;
      password: string;
      databaseName: string;
    }>([
      {
        type: "input",
        name: "databaseName",
        message: "What is the name of the database",
        initial: "pley",
      },
      {
        type: "input",
        name: "collectionName",
        message: "What is the name of the collection?",
        initial: "brands",
      },
      {
        type: "input",
        name: "importFilePath",
        message: "What is the path to the file?",
        initial: "~/Downloads/brands.json",
      },
      {
        type: "input",
        name: "exportFilePath",
        message: "What is the path to the file?",
        initial: "~/Downloads/brands.json",
      },
      {
        type: "input",
        name: "username",
        message: "What is the username?",
        initial: "destro45",
      },
      {
        type: "password",
        name: "password",
        message: "What is the password?",
      },
    ]);
    const spinnies = new Spinnies();

    spinnies.add("file-import", { text: "Importing file..." });
    await importFile({
      databaseName: response.databaseName,
      collectionName: response.collectionName,
      filePath: response.importFilePath,
      username: response.username,
      password: response.password,
    });
    spinnies.succeed("file-import", { text: "Imported file" });

    spinnies.add("database-connection", { text: "Connecting to database..." });
    await getConnection();
    spinnies.succeed("database-connection", { text: "Connected to database" });

    spinnies.add("document-fetch", { text: "Fetching documents..." });
    const docs = await BrandModel.find();
    spinnies.succeed("document-fetch", { text: "Fetched documents" });

    spinnies.add("document-clean", { text: "Cleaning documents..." });
    const filledInDocs = docs.map((currDoc) => {
      const error = currDoc.validateSync({
        pathsToSkip: ["_id", "__v"],
      });

      if (!error) {
        return currDoc;
      }

      const requiredErrors = Object.entries(error.errors).filter(([_, { name }]) => {
        return name === "ValidatorError";
      });

      const requiredErrorFields = requiredErrors.map(([field]) => field) as BrandTypeKeys[];

      const isRequiredError = requiredErrorFields.length > 0;

      if (!isRequiredError) {
        return currDoc;
      }

      const populatedDoc = consilidateRequiredErrors(currDoc, requiredErrorFields);

      const cleanedDoc = new BrandModel(populatedDoc);

      return cleanedDoc;
    });
    spinnies.succeed("document-clean", { text: "Cleaned documents" });

    spinnies.add("document-delete", { text: "Deleting documents..." });
    await BrandModel.deleteMany({});
    spinnies.succeed("document-delete", { text: "Deleted documents" });

    spinnies.add("document-insert", { text: "Inserting documents..." });
    await BrandModel.insertMany(filledInDocs);
    spinnies.succeed("document-insert", { text: "Inserted documents" });

    spinnies.add("file-export", { text: "Exporting file..." });
    await exportFile({
      databaseName: response.databaseName,
      collectionName: response.collectionName,
      filePath: response.exportFilePath,
      username: response.username,
      password: response.password,
    });
    spinnies.succeed("file-export", { text: "Exported file" });

    spinnies.add("database-close", { text: "Closing connection..." });
    await mongoose.disconnect();
    spinnies.succeed("database-close", { text: "Closed connection" });

    process.exit(0);
  } catch (error) {
    console.log({ error });
    process.exit(0);
  }
}

main();
