import Profile from '../model/profile.model.js'
import User from '../model/user.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import uploadFiles from '../utils/cloudinary.js'
import  jwt  from 'jsonwebtoken';
import { authType } from '../utils/helper.js'

const generateAccessRefreshToken = async(userId) => {
    const user = await User.findById(userId)



    const accessToken = await user.generateAccessToken()
    const refreshToken= await user.generateRefreshToken()


    user.refreshToken = refreshToken

    user.save({ validateBeforeSave : false })

    return {
      accessToken,
      refreshToken
    }
}

const accessRefershToken = asyncHandler(async(req,res)=>{
    const incomingTokenRefershToken = req.cookies.refreshToken || req.body.refreshToken



    if(!incomingTokenRefershToken) {
      throw new ApiError(401, "unAutharized request")
    }

    try {
      const decodedToken = jwt.verify(incomingTokenRefershToken , process.env.REFRESH_TOKEN_SECRET)

      const user = await User.findById(decodedToken?._id)



        if(!user) {
           throw new ApiError(401, "Invalid refresh token")
        }


        if(incomingTokenRefershToken !== user?.refreshToken) {
          throw new ApiError(401, "refresh token invalide or used")
        }


         const options = {
         httpOnly: true,
         secure : true
     }

        const { accessToken , refreshToken } = await generateAccessRefreshToken(user?._id)



        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200,{
          "accessToken"  : accessToken,
          "refreshToken" : refreshToken
        },"Token Refreshed"))


    } catch (error) {
        throw new ApiError(401,  `${error.message} accessRefreshToken` || "something went's wrong")
    }

})

const registerUser = asyncHandler(async(req,res)=>{

    const  { username, password, email, role } = req.body

      for(const [field, value] of Object.entries(req.body)){
          if(!value || String(value).trim()==="") {
                throw new ApiError(400, `The ${field} field is required`)
          }
      }


      const existUser = await User.findOne(
        {
            $or : [ { email } || { username }]
        }
      )

      if(existUser) {
        throw new ApiError(400, "User already exists with this email address")
      }

      const user = await User.create({
          email,
          password,
          username,
          role,
          isAuthorized : role === "Mentor" ? true : false
      })

     const registeredUser = await User.findById(user._id).select("-password -refreshToken")
     await Profile.create({user : user._id});

     return res.status(201).json(new ApiResponse(201, registeredUser, `${user.role} Successfully registered`) )
})

const loggedInUser = asyncHandler(async(req,res)=>{
      const { email, username, password } = req.body

      if(!email && !username) {
        throw new ApiError(400, "Email or username are required")
      }




      const user = await User.findOne({
          $or : [{ username } , { email }]
      })




      if(!user){
        throw new ApiError(401, "User not found")
      }

      if(!password) {
        throw new ApiError(400, "Password  is required")
      }

      const isPasswordValid = await user.isPasswordCorrect(password)

      if(!isPasswordValid) {
        throw new ApiError(401, "Wrong password")
      }

      const {accessToken, refreshToken} = await generateAccessRefreshToken(user._id)

      const loginUser = await User.findById(user._id).select("-password -refreshToken")

      const options = {
        httpsOnly : true,
        secure : true
      }


      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken" , refreshToken, options)
      .json(new ApiResponse(200,  loginUser, `${loginUser.role} Login success`))
})

const loggedOutUser = asyncHandler(async(req,res)=>{

  await User.findByIdAndUpdate(req.user._id, {
        $set : {refreshToken : ""}
    },{new  : true})

      const options = {
        httpsOnly : true,
        secure : true
      }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200, {}, "Logout success"))
})

const fetchUser = asyncHandler(async(req,res)=>{

     const userWithProfile = await Profile.findOne({ user: req.user._id }).populate({path : "user", select : "-password -refreshToken"})

    return res.status(200).json(new ApiResponse(200, userWithProfile , "User fetch"))
})

const updateProfileFileds = asyncHandler(async(req,res)=>{




      const userWithProfile = await Profile.findOne({ user: req.user._id }).populate({path : "user", select : "-password -refreshToken"})



      const update = await Profile.findByIdAndUpdate(
        userWithProfile._id,
        req.body,
        {
          new : true,
          runValidators : true
        }
      )





      return res.status(200).json(new ApiResponse(200, update, `user update Success`))
})

const updateAvatar = asyncHandler(async(req,res)=>{

      const userWithProfile = await Profile.findOne({ user: req.user._id }).populate({path : "user", select : "-password -refreshToken"})

      const file = req.files?.avatar[0]

        const avatarFile = await uploadFiles(file.path);

        if (!avatarFile || !avatarFile.url) {
          throw new ApiError(500, "Failed to upload avatar file");
        }


      const update = await Profile.findByIdAndUpdate(
        userWithProfile._id,
          {avatar : avatarFile.url},
        {
          new : true,
          runValidators : true
        }
      )

      return res.status(200).json(new ApiResponse(200, update, "user avatar Success"))
})

const isAuthorizationChanged = asyncHandler(async(req,res)=>{

    const mentor = req.user

    const { excustionTeamId } = req.params

    const { isAuthorized } = req.body

    const auth = authType(isAuthorized)


    if(auth === "undefined") {
        throw new ApiError(400, "isAuthorized is required")
    }

    if(mentor.role !== "Mentor") {
      throw new ApiError(403, "You do not have permission to perform this action.")
    }


    const excustionTeam = await User.findByIdAndUpdate(
        excustionTeamId,
        { isAuthorized : auth },
        {
          new: true,
          runValidators: true,
        }
    ).select("-password -refreshToken");

    if(!excustionTeam) {
       throw new ApiError(404, "User not found")
    }

  return res.status(200).json(new ApiResponse(200, {} , `Authorization updated`))
})

const fetchAllExcutionTemMembers = asyncHandler(async(req,res)=>{

      const mentor = req.user

      if(!mentor.role === "Mentor") {
          throw new ApiError(403, "You do not have permission to perform this action...")
      }

      const executionTeamMembers = await User.find(
           {role : "ExecutionTeam"}
      ).select("-password -refreshToken")


      return res.status(200).json(new ApiResponse(200 , executionTeamMembers, " fetch Successfully Execution Team Members"))
})

const changeCurrentPassword = asyncHandler(async(req,res)=>{
      const { newPassword, oldPassword } = req.body

      const user = await User.findById(req.user?._id)


      if(!user) {
            throw new ApiError(404, "user not found")
      }

      const isPasswordValid = await user.isPasswordCorrect(oldPassword)

      if(!isPasswordValid) {
        throw new ApiResponse(404, "Invalid credentials")
      }

      user.password = newPassword
      await user.save({ validateBeforeSave : false })

      return res.status(200).json(new ApiResponse(200, {}, "current password change successfully"))
})

const deleteAccount = asyncHandler(async(req,res)=>{
      await User.findByIdAndDelete(req.user._id)

      return res.status(200).json(new ApiResponse(200,{}, "user account delete successfully"))
})


export {
  fetchAllExcutionTemMembers,
  fetchUser,
  isAuthorizationChanged,
  loggedInUser,
  loggedOutUser,
  registerUser,
  updateAvatar,
  updateProfileFileds,
  accessRefershToken,
  changeCurrentPassword,
  deleteAccount
}
