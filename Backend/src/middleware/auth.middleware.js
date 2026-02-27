import jwt from 'jsonwebtoken'
import User from '../model/user.model.js'
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'

const verifyJWT = asyncHandler(async(req,_,next) => {
        try {

           const incomingToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

              if(!incomingToken){
                throw new ApiError(404, "Invalid token")
              }

           const decodedToken =  jwt.verify(incomingToken, process.env.ACCESS_TOKEN_SECRET)

          if(!decodedToken) {
            throw new ApiError(400, "token used or expired")
          }

          const user = await User.findById(decodedToken._id).select("-password -refreshToken")

          if(!user) {
            throw new ApiError(400, "Please check token")
          }
          req.user = user

          next()

        } catch (error) {
            throw new ApiError(400, error.message || "Invalid Token or Expired")
        }

})

export default verifyJWT
