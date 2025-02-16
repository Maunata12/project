import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/app/lib/connect";
import CalorieLog from "@/app/lib/schema/calorieLogSchema";
import User from "@/app/lib/schema/userSchema";

export async function POST(request) {
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

    const res = await request.json();
    const { dailyLimit, caloriesConsumed } = res;

    if (!dailyLimit || !caloriesConsumed) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Daily limit and calories consumed are required.",
        }),
        { status: 400 }
      );
    }

    const currentDate = new Date();
    const dayOfWeek = currentDate
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    const newCalorieLog = new CalorieLog({
      dailyLimit,
      caloriesConsumed,
      dayOfWeek,
      userId: user._id,
    });

    await newCalorieLog.save();

    return new Response(
      JSON.stringify({
        message: "Calorie data created successfully.",
        success: true,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "An error occurred while creating the calorie data.",
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
