import { Schema } from "mongoose";
import { BrandTypeKeys } from "../schemas/brands.schema";

const castOrGetDefault = (
  fieldName: BrandTypeKeys,
  schema: Schema,
  currentFieldValue?: unknown
) => {
  const field = schema.paths[fieldName];
  const fieldType = field.instance;

  if (fieldName === "yearFounded") {
    const currentYear = new Date().getFullYear();
    if (typeof currentFieldValue === "string" || typeof currentFieldValue === "number") {
      const year = parseInt(currentFieldValue as string);
      if (isNaN(year) || year > currentYear || year < 1600) {
        return 1600;
      }
      return year;
    }
    return 1600;
  }

  if (fieldName === "numberOfLocations") {
    if (typeof currentFieldValue === "string" || typeof currentFieldValue === "number") {
      const numberOfLocations = parseInt(currentFieldValue as string);
      if (isNaN(numberOfLocations) || numberOfLocations < 1) {
        return 1;
      }
      return numberOfLocations;
    }
    return 1;
  }

  if (
    (Array.isArray(currentFieldValue) || Object.keys(currentFieldValue || {}).length) &&
    fieldType === "String"
  ) {
    return JSON.stringify(currentFieldValue);
  }
};

export default castOrGetDefault;
