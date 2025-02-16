import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/app/lib/connect";
import CalorieLog from "@/app/lib/schema/calorieLogSchema";
import User from "@/app/lib/schema/userSchema";
import fitnessSchema from "@/app/lib/schema/fitnessSchema";

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

    // Fetch calorie logs specific to the logged-in user
    const calorieLogs = await fitnessSchema.find({ userId: user._id });

    return new Response(JSON.stringify(calorieLogs), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "An error occurred while fetching calorie data.",
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
