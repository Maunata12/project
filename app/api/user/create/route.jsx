import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import User from "@/app/lib/schema/userSchema";
import connectToDatabase from "@/app/lib/connect";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const email = session.user.email;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "exist" }, { status: 200 });
    }

    // Generate a unique username
    let username = email.split("@")[0];
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      const usernameTaken = await User.findOne({ username });
      if (!usernameTaken) {
        isUnique = true;
      } else {
        username = `${email.split("@")[0]}${Math.floor(Math.random() * 1000)}`;
      }
      attempts++;
    }

    const { name, image } = session.user;
    const newUser = new User({ username, email, name, image, type: "user" });
    await newUser.save();

    return NextResponse.json({ message: "created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
