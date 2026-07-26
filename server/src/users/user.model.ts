import { Schema, model, type Model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      default: "user",
    },

    picture: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true },
);

const User = model("user", userSchema);

export default User;

export interface INewsLetters extends Document {
  email: string;
}

const newLetterSchema = new Schema<INewsLetters>({
  email: { type: String, required: true, unique: true },
});

export const NewsLetter: Model<INewsLetters> = model<INewsLetters>(
  "newsletter",
  newLetterSchema,
);
