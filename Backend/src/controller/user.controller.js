import Profile from '../model/profile.model.js'
import User from '../model/user.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

const generateAccessRefreshToken = async(userId) => {
    const user = await User.findById(userId)

    const accessToken = await user.generateAccessToken()
    const refreshToken= await user.generateRefreshToken()


    user.save({ validateBeforeSave : false })

    return {
      accessToken,
      refreshToken
    }
}

const registerUser = asyncHandler(async(req,res)=>{

      const  { username, password, email, role } = req.body


      const requiredFileds = [email,password,username]


      if(requiredFileds.some(field  => field.trim() === "")){
        throw new ApiError(404, "All fields are required")
      }

      const existUser = await User.findOne(
        {
            $or : [ { email } || { username }]
        }
      )

      if(existUser) {
        throw new ApiError(400, "Use already exist")
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

     return res.status(200).json(new ApiResponse(200, registeredUser, `${user.role} Register Successfully`) )
})

const loggedInUser = asyncHandler(async(req,res)=>{
      const { email, username, password } = req.body

      if(!(email || username)) {
        throw new ApiError(404, "Email or username are required")
      }

      const user = await User.findOne({
          $or : [{ email } || { username }]
      })

      if(!password) {
        throw new ApiError(404, "Password  is required")
      }

      const isPasswordCorrect = await user.isPasswordCorrect(password)

      if(!isPasswordCorrect) {
        throw new ApiError(404, "Invalid password please check out the password")
      }

      const loginUser = await User.findById(user._id).select("-password -refreshToken")

      const {accessToken, refreshToken} = await generateAccessRefreshToken(user._id)

      const options = {
        httpsOnly : true,
        secure : true
      }

      console.log("refreshToken" , refreshToken);
      console.log("accessToken", accessToken);


      return res
      .status(200)
      .cookie("refreshToken" , refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200,  loginUser, `${loginUser.role} loggedIn Successfully`))
})

const loggedOutUser = asyncHandler(async(req,res)=>{

  await User.findByIdAndUpdate(req.user._id, {
        $set : {refreshToken : ""}
    },{new  : true})

      const options = {
        httpsOnly : true,
        secure : true
      }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200, {}, "user logged out Successfully"))
})

const fetchUser = asyncHandler(async(req,res)=>{

     const userWithProfile = await Profile.findOne({ user: req.user._id }).populate({path : "user", select : "-password -refreshToken"})

    return res.status(200).json(new ApiResponse(200, userWithProfile , "user fetch Successfully"))
})

const updateProfileFileds = asyncHandler(async(req,res)=>{

    console.log(req.user);


      const userWithProfile = await Profile.findOne({ user: req.user._id }).populate({path : "user", select : "-password -refreshToken"})

      console.log(req.body);

      const update = await Profile.findByIdAndUpdate(
        userWithProfile._id,
        req.body,
        {
          new : true,
          runValidators : true
        }
      )

      console.log(update);



      return res.status(200).json(new ApiResponse(200, update, `user update Successfully`))
})

const updateAvatar = asyncHandler(async(req,res)=>{

      const userWithProfile = await Profile.findOne({ user: req.user._id }).populate({path : "user", select : "-password -refreshToken"})

      const file = req.files?.avatar[0]

      console.log(file.path);


      const update = await Profile.findByIdAndUpdate(
        userWithProfile._id,
          {avatar : file.path},
        {
          new : true,
          runValidators : true
        }
      )

      return res.status(200).json(new ApiResponse(200, update, "user avatar successfully"))
})

const isAuthorizationChanged = asyncHandler(async(req,res)=>{

    const mentor = req.user

    const { excustionTeamId } = req.params

    const { isAuthorized } = req.body

    Boolean(isAuthorized)

    if(typeof isAuthorized === "undefined") {
        throw new ApiError(400, "isAuthorized is required")
    }

    const parseIsAuthorized = String(isAuthorized) === "true";

    if(mentor.role !== "Mentor") {
      throw new ApiError(404, "unAutharized required")
    }


    const excustionTeam = await User.findByIdAndUpdate(
        excustionTeamId,
        { isAuthorized : parseIsAuthorized },
        {
          new: true,
          runValidators: true,
        }
    ).select("-password -refreshToken");

    if(!excustionTeam) {
       throw new ApiError(400, "Execution Team is not found")
    }

  return res.status(200).json(new ApiResponse(200, {} , `Authorization updated`))
})

const fetchAllExcutionTemMembers = asyncHandler(async(req,res)=>{

      const mentor = req.user

      if(!mentor.role === "Mentor") {
          throw new ApiError(400, "unAutharized Request")
      }

      const executionTeamMembers = await User.find(
          { $match : {role : "ExecutionTeam"}}
      ).select("-password -refreshToken")

      console.log(executionTeamMembers);


      return res.status(200).json(new ApiResponse(200 , executionTeamMembers, " fetch Successfully Execution Team Members"))
})



export {
  fetchUser,
  isAuthorizationChanged,
  loggedInUser,
  loggedOutUser,
  registerUser,
  updateAvatar,
  updateProfileFileds,
  fetchAllExcutionTemMembers
}
