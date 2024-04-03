# Pley Data engineering task

## Goal

The goal is to clean brands data to be aligned to the schema as best as possible

```ts
 {
    brandName: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
    },
    yearFounded: {
      type: Number,
      required: [true, "Year founded is required"],
      min: [1600, "Year founded seems too old"],
      max: [new Date().getFullYear(), "Year founded cannot be in the future"],
    },
    headquarters: {
      type: String,
      required: [true, "Headquarters location is required"],
      trim: true,
    },
    numberOfLocations: {
      type: Number,
      required: [true, "Number of locations is required"],
      min: [1, "There should be at least one location"],
    },
  },
  {
    timestamps: true,
  }

```

---

## Technologies Used

### Main

- Node.js
- Typescript

### CLI building

- enquirer
- spinnies

### Data seeding

- faker

---
