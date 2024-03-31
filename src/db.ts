import mongoose from 'mongoose';

const getConnection = async (): Promise<void> => {
  await mongoose.connect(process.env.DATABASE_URL || "");
};

export { getConnection };
