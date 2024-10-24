import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  email: string;
  username: string;
  password: string;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email is unique
    },
    username: {
      type: String,
      required: true,
      unique: true, // Ensure username is unique
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const userModels = mongoose.model<IUser>("users", UserSchema);
