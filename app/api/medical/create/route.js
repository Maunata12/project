import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectToDatabase from "@/app/lib/connect";
import Medical from "@/app/lib/schema/medicalSchema";
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

    const { alarms } = await request.json();
    if (!alarms) {
      return new Response(
        JSON.stringify({ success: false, message: "Alarms data is required." }),
        { status: 400 }
      );
    }

    // if Medical data already exists, update it
    const existingMedicalData = await Medical.findOne({ userId: user._id });
    if (existingMedicalData) {
      existingMedicalData.alarms = alarms;
      await existingMedicalData.save();

      return new Response(
        JSON.stringify({
          message: "Medical alarms updated successfully.",
          success: true,
        }),
        { status: 200 }
      );
    }

    const newMedicalLog = new Medical({
      userId: user._id,
      alarms,
    });

    await newMedicalLog.save();

    return new Response(
      JSON.stringify({
        message: "Medical alarms saved successfully.",
        success: true,
      }),
      { status: 201 }
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
