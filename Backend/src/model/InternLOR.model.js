import mongoose, { Schema, model } from "mongoose";

const InterLORSchema = new Schema(
  {
     name : {
      type : String,
      required: true
     },
     email : {
        type : String,
        required: true,
        trim: true
     },
     department : {
          type : String,
          required : true
      },
      endDate : {
        type : Date
      },
      startDate : {
        type : Date
      },
      approval : {
        approvedBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
          },
          status  : {
             type : Boolean,
            default : false
          },
          comment : {
            type : String,
            default : ""
          }
      },
  }
  ,{
    timestamps : true
  }
)

const InternLOR = model("InternLOR", InterLORSchema)
export default InternLOR
