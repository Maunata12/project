import connectToDatabase from "@/app/lib/connect";
import User from "@/app/lib/schema/userSchema";

export async function GET() {
  await connectToDatabase();

  const users = await User.find();
  return Response.json({
    users,
    success: true,
  });
}