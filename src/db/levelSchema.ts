import mongoose, { Document, Schema } from "mongoose";

interface ILevel extends Document {
  userid: string;
  level: string;
  star: Number;
}

const LevelSchema: Schema = new Schema(
  {
    userid: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    star: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const levelModel = mongoose.model<ILevel>("level", LevelSchema);
