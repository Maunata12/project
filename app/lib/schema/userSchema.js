import { Schema } from "mongoose";
import { model, models } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    type : {
      type: String,
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User = models.User || model("User", userSchema);
export default User;
