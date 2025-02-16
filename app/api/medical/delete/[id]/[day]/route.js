import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Medical from "@/app/lib/schema/medicalSchema";
import User from "@/app/lib/schema/userSchema";
import { getServerSession } from "next-auth";

export async function DELETE(request, { params }) {
  const { id, day } = params;

  if (!id || !day) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid request" }),
      { status: 400 }
    );
  }

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

  const userId = user._id;

  const medicalData = await Medical.findOne({ userId });
  if (!medicalData) {
    return new Response(
      JSON.stringify({ success: false, message: "Medical data not found" }),
      { status: 404 }
    );
  }

  const alarms = medicalData.alarms;

  // Check if the day exists in the alarms object
  if (!alarms.hasOwnProperty(day)) {
    return new Response(
      JSON.stringify({ success: false, message: "Day not found in alarms" }),
      { status: 404 }
    );
  }

  // Get the data for the specific day
  const dayData = alarms[day];

  // Delete the id from the day data
  const index = dayData.filter((item) => item._id === id);
  if (!index) {
    return new Response(
      JSON.stringify({ success: false, message: "Id not found", dayData, id }),
      { status: 404 }
    );
  }

  dayData.splice(index, 1);

  // Update the alarms object
  medicalData.alarms[day] = dayData;
  await medicalData.save();

  return new Response(JSON.stringify({ success: true, data: dayData, day }), {
    status: 200,
  });
}
