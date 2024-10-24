import mongoose, { Document, Schema } from "mongoose";

interface ILeaderBoard extends Document {
  username: string;
  userid: string;
  points: Number;
}

const LeaderBoardSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const leaderBoardModel = mongoose.model<ILeaderBoard>(
  "leadeboard",
  LeaderBoardSchema
);
