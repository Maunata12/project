import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@/app/lib/schema/userSchema"; // Import your Mongoose model
import connectToDatabase from "@/app/lib/connect"; // Import your connection function

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session }) {
      await connectToDatabase();

      const user = await User.findOne({ email: session.user.email });

      if (user) {
        session.user.type = user.type;
      }

      return session;
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
