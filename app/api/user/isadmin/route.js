import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/app/lib/connect";
import User from "@/app/lib/schema/userSchema";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" });
  }
  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return Response.json({ message: "User not found" });
  }

  return Response.json({
    email: user.email,
    image: user.image,
    name: user.name,
    role: user.type,
  });
}