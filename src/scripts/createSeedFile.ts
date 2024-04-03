const NUMBER_OF_SEEDS = 20;

import generateFakeBrandData from "../utils/generateFakeBrandData";

import fs from "fs/promises";
import path from "path";

async function run() {
  try {
    const directory = path.join(path.dirname(__dirname), "../", "seed");

    await fs.mkdir(directory, { recursive: true });

    const seeds = Array.from({ length: NUMBER_OF_SEEDS }, () => generateFakeBrandData());
    console.log({ seeds });

    await fs.writeFile(path.join(directory, "brands.json"), JSON.stringify(seeds));

    console.log("File written");
  } catch (error) {
    console.error(error);
  }

  process.exit(0);
}

run();
