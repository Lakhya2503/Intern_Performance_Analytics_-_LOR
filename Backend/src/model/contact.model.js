import { model, Schema } from 'mongoose'


const contactSchema = new Schema(
    {
       sender : {
                type : Schema.Types.ObjectId,
                ref : "User"
      },
      fullName : {
              type: String,
              required : true,
              default : ""
      },
       email : {
              type: String,
              required : true,
              default : ""
      },
        message : {
                type : String,
                required : true
        },
        subject : {
                type : String,
                required: true
        },

        // Mentor can send replay
        replayMentor : {
                  type : Schema.Types.ObjectId ,
                  ref : "User",
        },
        replayMessage : {
                  type : String,
                  default : null
        },
        replayAt : {
                type : Date,
                default : null
        },
        status : {
                type : String,
                enum : ["pending", "replied"],
                default : "pending"
        }
    }
    ,{ timestamp : true }
)

const Contact = model("Contact", contactSchema)

export default Contact
