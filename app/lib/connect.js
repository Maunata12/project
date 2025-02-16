import { connect } from "mongoose";

async function connectToDatabase() {
  try {
    await connect(process.env.NEXT_PUBLIC_MONGODB_URL);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
}

export default connectToDatabase;
