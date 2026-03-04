import Contact from '../model/contact.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

const sendMessage = asyncHandler(async(req,res)=>{
        const { message, subject, email, fullName } = req.body

        if(req.user.role === "Mentor") {
            throw new ApiError(400, "mentor can't send message, If you have any query you can ask to Admin")
        }

        if([fullName,email,message].some((item)=> { item.trim() === "" })) {
            throw new ApiError(404, "All fields are required")
        }

       if (req.user.email !== email) {
          throw new ApiError(403, "You are not authorized to perform this action or kindly check your email")
        }

        const createMessage = await Contact.create({
                  sender : req?.user,
                  email,
                  fullName,
                  subject,
                  message
        })

        const sendMessage = await Contact.findById(createMessage._id).select("-replayMentor -replayMessage -replayAt")


        return res.status(200).json(new ApiResponse(200, sendMessage, "Message send Successfully"))
})

const getAllMessagesForMentor = asyncHandler(async(req,res)=> {

      // if(req.user.role !== "Mentor") {
      //   throw new ApiError(404, "unAuthorized requirest")
      // }



        const allMessages = await Contact.find(
            { status : "pending" }
        ).lean()


      if(allMessages.length === 0) {
        return res.status(200).json(new ApiResponse(200, {},"you have no message"))
      }



        return res.status(200).json(new ApiResponse(200, allMessages, "Fetch All Messages"))
})

const replayOfSender = asyncHandler(async(req,res)=>{

    if(req.user.role !== "Mentor") {
      throw new ApiError(404, "unAuthorized request");
    }

    const { senderId } = req.params

    const { sendMessage } =  req.body

    const date = new Date(Date.now());

    const replayMessage = await Contact.findByIdAndUpdate( senderId, {
              replayMentor : req?.user ,
              replayMessage : sendMessage,
              replayAt : date,
              status : "replied"
    } )

  return res.status(200).json(new ApiResponse(200 , replayMessage , "Replay send to sender Successfully"))
})

const getMessage = asyncHandler(async(req,res)=>{

      const getMessage = await Contact.find({
            sender : req.user._id,
            status : "replied"
      })

      if(getMessage.length === 0) {
        return res.status(200).json(new ApiResponse(200, {},"you have no message"))
      }

        return res.status(200).json(new ApiResponse(200, getMessage, "messages fetch Successfully"))
})

const deleteMessage = asyncHandler(async(req,res)=>{

     const { messagId } = req.params



        const fetchMessage = await Contact.findByIdAndDelete({
                _id  : messagId
          })

      console.log(fetchMessage);


      // await Contact.findByIdAndDelete(messagId)

      return res.status(200).json(new ApiResponse(200, { fetchMessage }, "Message delete Successfully"))
})

const getSendMessage =  asyncHandler(async(req,res)=>{


              if(req.user.role !== "Mentor") {
                throw new ApiError(404,
                  "u r not an mentor"
                )
              }

            const getMessage = await Contact.find({
                   replayMentor : req.user,
                    status : "replied"
            })


        if(getMessage.length === 0) {
               return res.status(200).json(new ApiResponse(200, {},"you have no message"))
        }

        return res.status(200).json(new ApiResponse(200, getMessage, "messages fetched"))
})





export {
  deleteMessage, getAllMessagesForMentor, getMessage, getSendMessage, replayOfSender, sendMessage
}
