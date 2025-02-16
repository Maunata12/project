import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/app/lib/connect";
import CalorieLog from "@/app/lib/schema/calorieLogSchema";
import User from "@/app/lib/schema/userSchema";
import fitnessSchema from "@/app/lib/schema/fitnessSchema";

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
    const { fitnessId } = res;

    // check if any fitness by this user is made today or not, if made update on that else create new
    const fitness = await fitnessSchema.findOne({
      userId: user._id,
      dayOfWeek: new Date()
        .toLocaleString("en-US", { weekday: "long" })
        .toLowerCase(),
    });

    if (fitness) {
      await fitnessSchema.updateOne({ _id: fitness._id }, { fitnessId });

      return new Response(
        JSON.stringify({
          message: "Fitness data updated successfully.",
          success: true,
        }),
        { status: 200 }
      );
    }

    if (!fitnessId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Fitness ID is required.",
        }),
        { status: 400 }
      );
    }

    const currentDate = new Date();
    const dayOfWeek = currentDate
      .toLocaleString("en-US", { weekday: "long" })
      .toLowerCase();

    const newFitness = new fitnessSchema({
      fitnessId,
      dayOfWeek,
      userId: user._id,
    });

    await newFitness.save();

    return new Response(
      JSON.stringify({
        message: "Fitness data created successfully.",
        success: true,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "An error occurred while creating the fitness data.",
        success: false,
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
