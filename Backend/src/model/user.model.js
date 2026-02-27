import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { model, Schema } from 'mongoose'

const userSchema = new Schema(
  {
      username : {
        type : String,
        required : true,
        unique : true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
      },
      password : {
        type : String,
        required : true
      },
      refreshToken  : {
        type : String
      },
      isAuthorized : {
        type : Boolean,
        default : false
      },
      role : {
        type : String,
        default : ""
      }

},{timestamps : true})

// when password doesn't change or update then return this otherwise work the function
 userSchema.pre("save", async function () {
      if(!this.isModified("password")) return
      this.password = await bcrypt.hash(this.password, 10)
 })

 // when user wan't to login or change the current password
 userSchema.methods.isPasswordCorrect = function(password){
      return bcrypt.compare(password, this.password)
 }

 // for generate accessToken
 userSchema.methods.generateAccessToken = function(){
   const payload = {
     _id : this._id,
     username : this.username,
     email : this.email,
    }
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY || "1h"
      }
    )
  }

  // for generate refreshToken
userSchema.methods.generateRefreshToken = function() {
    const payload = {
      _id : this._id
    }
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn  : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const User = model("User", userSchema)
export default User;
