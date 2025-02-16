import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/app/lib/schema/userSchema";
import connectToDatabase from "@/app/lib/connect";

export async function POST(request) {
  try {
    const session = await getServerSession({ authOptions });
    await connectToDatabase();

    if (!session) {
      return Response.json({ message: "Unauthorized", success: false });
    }

    const email = session.user.email;

    const checkUser = await User.findOne({ email });
    if (!!checkUser) {
      return Response.json({
        message: "exist",
        user: checkUser,
        success: false,
      });
    } else {
      let username = email.split("@")[0];
      const checkUsername = await User.findOne({ username });

      if (!!checkUsername) {
        username = username + Math.floor(Math.random() * 1000);
      }

      const name = session.user.name;
      const image = session.user.image;

      const user = new User({ username, email, image });
      await user.save();

      return Response.json({ message: "created", success: true });
    }
  } catch (error) {
    console.error("Error in user creation:", error);
    return Response.json({
      message: "Error",
      error: error.message,
      success: false,
    });
  }
}
