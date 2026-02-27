import { model, Schema } from "mongoose";

const profileSchema = new Schema(
  {
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    },
    avatar : {
      type : String
    },
    fullName : {
      type : String
    },
    bio : {
      type : String
    }
  },{timestamps : true}
)

const Profile = model("Profile", profileSchema)

export default Profile;
