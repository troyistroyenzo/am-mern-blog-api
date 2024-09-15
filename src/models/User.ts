import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  passwordHash: string;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

export type IUserDto = Pick<IUser, "_id" | "__v" | "username">;
export type IUserWithTokenDto = IUserDto & { token: string };
export type ILoginUserDto = Pick<IUserDto, "username"> & { password: string };
export type ICreateUserDto = ILoginUserDto & { reEnterPassword: string };
