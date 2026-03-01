import { model, Schema } from 'mongoose';

const internSchema = new Schema(
    {
        _id : {
          type : String,
          required: true
        },
        name : {
          type : String,
          required : true
        },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },
        gender : {
          type : String,
          default : ""
        },
        course : {
          type : String,
          required : true
        },
        startDate : {
            type : Date,
            default : Date.now()
        },
        endDate : {
          type  : Date,
        },
        department : {
          type : String,
          required : true
        },
        mentor : {
          type : String,
          required : true
        },
        isActive:{
          type: Boolean,
          default : false
        },
        isCompliantIssue : {
          type : Boolean,
          default : false
        },
        isDisciplineIssue : {
           type : Boolean,
           default : false
        },
        score : {
          type : Number
        }
    },{
      timestamps : true
    }
)

const Intern = model("Intern", internSchema);
export default Intern
