import InternLOR from "../model/internLOR.model.js"
import Intern from "../model/interns.model.js"
import { sendLorViaEmail } from "../services/email.service.js"
import { generateLORService } from "../services/lorPDF.service.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { approveVerify } from "../utils/helper.js"

const lorUpload = asyncHandler((req,res)=>{

    const file = req.files.lorTemp[0].filename

  return res.status(200).json(new ApiResponse(200, {} , `${file} upload successfully`))
})

const generateLOR = asyncHandler(async(req,res)=>{
      const { internId } = req.params

      const status = req.body?.status
      const comment = req.body?.comment

    const approvestatus = approveVerify(status)

      const mentor = req.user

      if(!mentor.role === "Mentor") {
          throw new ApiError(400, "unAuthorized request")
      }

     const intern = await Intern.findById(internId)


    if(!intern) {
      throw new ApiError(400, "Intern does not exists")
    }

    const internwithLorExist = await InternLOR.findOne({ email: intern.email });


    if(internwithLorExist) {
      throw new ApiError(400, "intern has already send the LOR")
    }

     const  internLOR =  await InternLOR.create({
          name : intern.name,
          email : intern.email,
          department : intern.department,
          endDate : intern.endDate,
          startDate : intern.startDate,
          approval : {
              approvedBy : mentor,
              status : approvestatus,
              comment : comment === "" ? "" : comment
          }
     })

     if(!internLOR.approval.status) {
      throw new ApiError(400, "intern can't create or send pdf of url")
    } else if (internLOR.approval.status) {
      const { pdfBuffer, fileName } = await generateLORService(internLOR)
      //  await sendLorViaEmail(intern.email, intern.name, pdfBuffer, fileName)
    }


    return res
    .status(200)
    .json(
          new ApiResponse(200, {}, "LOR is being generated and will be sent to the registered email")
    );
})

const internsWithLor = asyncHandler(async(req,res)=>{

      const internsWithLorGen = await InternLOR.find().lean()

      return res.status(200).json(new ApiResponse(200, internsWithLorGen, "interns with LOR"))

})

const rejectedInternsForLorGeneration = asyncHandler(async(req,res) =>{

    const internsWithLorGen = await InternLOR.aggregate([
          {
            $match : { "approval.status" : false }
          }
      ])

      return res.status(200).json(new ApiResponse(200,internsWithLorGen, "rejected interns of LOR Generation"))

})

const updateAndSendLor = asyncHandler(async(req,res)=>{

      const { internLorId} = req.params

     const updateInternLor =  await InternLOR.findByIdAndUpdate(internLorId, {
          $set : {
            approval : {
              status : true,
              comment : ""
            }
          }
      }, {new : true })

      const mentor = req.user

       const { pdfBuffer, fileName } = await generateLORService(updateInternLor)
       await sendLorViaEmail(updateInternLor.email, updateInternLor.name, pdfBuffer, fileName)

      if(!mentor.role === "Mentor") {
          throw new ApiError(400, "unAuthorized request")
      }
})



export {
  generateLOR,
  lorUpload,
  internsWithLor,
  rejectedInternsForLorGeneration,
  updateAndSendLor
}
