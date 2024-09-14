import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
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

export type ILoginUserDto = {
  username: string;
  password: string;
};
export type IRegisterUserDto = ILoginUserDto;
export type IUserJson = Pick<IUser, "username"> & {
  token: string;
};
