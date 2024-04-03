const NUMBER_OF_SEEDS = 20;

import generateFakeBrandData from "../utils/generateFakeBrandData";
import fs from "fs/promises";
import path from "path";
import ExcelJs from "exceljs";
import { BrandTypeKeys } from "../schemas/brands.schema";

async function run() {
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet("Brands");

  const BrandHeaderArray: {
    header: BrandTypeKeys;
    key: BrandTypeKeys;
  }[] = [
    { header: "brandName", key: "brandName" },
    { header: "yearFounded", key: "yearFounded" },
    { header: "headquarters", key: "headquarters" },
    { header: "numberOfLocations", key: "numberOfLocations" },
  ];

  worksheet.columns = BrandHeaderArray;

  try {
    const directory = path.join(path.dirname(__dirname), "../", "seed");

    await fs.mkdir(directory, { recursive: true });

    const seeds = Array.from({ length: NUMBER_OF_SEEDS }, () => generateFakeBrandData());

    const randId = (new Date().getMilliseconds() * Math.random()).toFixed(3);

    seeds.forEach((seed) => {
      worksheet.addRow(seed);
    });

    worksheet.addRow({ count: seeds.length });

    await fs.writeFile(
      path.join(directory, `brands-${randId}.json`),
      JSON.stringify(seeds, null, 2)
    );

    await worksheet.workbook.xlsx.writeFile(path.join(directory, `brands-summary-${randId}.xlsx`));

    console.log("File written");
  } catch (error) {
    console.error(error);
  }

  process.exit(0);
}

run();
