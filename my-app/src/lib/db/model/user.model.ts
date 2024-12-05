import mongoose, { Schema, Document} from "mongoose";

export interface User extends Document {
  name: string, 
  email: string,
  profileimageurl: string,
  userId: string,
  credits: number,
  twitterlogin: boolean,
  twitterloginid: string,
  hashnodelogin: boolean,
  linkedinlogin: boolean,
}

const UserSchema: Schema<User> = new Schema(
    {
    name: { type: String, required: true },
    email: { type: String, required: true },
    profileimageurl: { type: String, required: false },
    userId: { type: String, required: true },
    credits: { type: Number, required: true },
    twitterlogin: { type: Boolean, required: false },
    twitterloginid: { type: String, required: false },
    hashnodelogin: { type: Boolean, required: false },
    linkedinlogin: { type: Boolean, required: false }
  },
  { timestamps: true }  // Automatically adds createdAt and updatedAt fields
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;