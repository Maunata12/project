import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/app/lib/connect";
import Medical from "@/app/lib/schema/medicalSchema";
import User from "@/app/lib/schema/userSchema";

export async function GET(request) {
  await connectToDatabase();

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401 }
      );
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    const medicalData = await Medical.findOne({ userId: user._id });

    return new Response(
      JSON.stringify({ success: true, data: medicalData || {} }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "An error occurred.",
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
