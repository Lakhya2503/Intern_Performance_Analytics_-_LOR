import InternLOR from "../model/internLOR.model.js"
import Intern from "../model/interns.model.js"
import parseFileToJson from "../parser/parseInternsData.js"
import { generateLORService } from "../services/lorPDF.service.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import asyncHandler from "../utils/asyncHandler.js"
import { approveVerify } from "../utils/helper.js"
import path from 'path'

const lorUpload = asyncHandler((req,res)=>{


  const file = req.files.lorTemp[0].filename


  return res.status(200).json(new ApiResponse(200, {} , `${file} upload successfully`))
})

const generateLOR = asyncHandler(async(req,res)=>{
      const { internId } = req.params

      const status = req.body?.status
      const comment = req.body?.comment

      // console.log(status);

      // console.log();


    const approvestatus = approveVerify(status)

      const mentor = req.user

      if(!mentor.role === "Mentor") {
          throw new ApiError(400, "unAuthorized request")
      }

     const intern = await Intern.findById(internId)


    if(!intern) {
      throw new ApiError(400, "Intern does not exists")
    }

    // const internwithLorExist = await InternLOR.findOne({ email: intern.email });


    // if(internwithLorExist) {
    //   throw new ApiError(400, "intern has already send the LOR")
    // }

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

    //  console.log(internLOR.approval.status);


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

const uploadBulkInternsForLogGeneration = asyncHandler(async(req,res)=>{

    const file = req.files?.bulkInternOfLorGen[0]

    console.log("req.files",req.files);


    if(!file) {
      throw new ApiError(404, "Inters file doesn't exists")
    }

    const extension = path.extname(file.originalname)

    const data = await parseFileToJson(extension, file.path)


          for (const internsLor of data) {

              // console.log(internsLor);


                  const intern = await Intern.findById(internsLor.intern_id)

                  // console.log(intern);


                  const internCreateForLor = await InternLOR.create({
                      name : intern.name,
                      email : intern.email,
                      department : intern.department,
                      endDate : intern.endDate,
                      startDate : intern.startDate,
                      approval  : {
                        approvedBy : req.user,
                        status : internsLor.status,
                        comment : internsLor.comment
                      },
                  })

                  


                  if(internCreateForLor.approval.status) {
                       const { pdfBuffer, fileName } = await generateLORService(internCreateForLor)
                        // await sendLorViaEmail(internCreateForLor.email, internCreateForLor.name, pdfBuffer, fileName)
                  }

          }


  return res.status(200).json(new ApiResponse(200, {},"interns have successfully generation lors"))
})

const internRejectOfGenLor = asyncHandler(async(req,res)=>{

      const { internId } = req.params

      // console.log(internId);


      const status = req.body?.status
      const comment = req.body?.comment

      // console.log(req.body);


    const approvestatus = approveVerify(status)

      const mentor = req.user



      if(!mentor.role === "Mentor") {
          throw new ApiError(400, "unAuthorized request")
      }

     const intern = await Intern.findById(internId)


    if(!intern) {
      throw new ApiError(400, "Intern does not exists")
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


    return res.status(200).json(new ApiResponse(200, internLOR , "intern are rejecte to generating the lor"))
})

const internsWithLor = asyncHandler(async(req,res)=>{

      const internsWithLorGen = await InternLOR.aggregate([
        {
          $match : { "approval.status" : true  }
        }
      ])



      return res.status(200).json(new ApiResponse(200, internsWithLorGen, "interns with LOR"))

})

const rejectedInternsOfLorGeneration = asyncHandler(async(req,res) =>{



    const internRejectedOfLor = await InternLOR.aggregate([
          {
            $match : { "approval.status" : false }
          }
      ])

      // console.log(internRejectedOfLor);


      return res.status(200).json(new ApiResponse(200,internRejectedOfLor, "rejected interns of LOR Generation"))

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

            if(!mentor.role === "Mentor") {
                throw new ApiError(400, "unAuthorized request")
            }

       const { pdfBuffer, fileName } = await generateLORService(updateInternLor)
      //  await sendLorViaEmail(updateInternLor.email, updateInternLor.name, pdfBuffer, fileName)
      return res.status(200).json(new ApiResponse(200, {}, "intern has update and send lor via email"))
})

const resendEmailOfLor = asyncHandler(async(req,res)=>{
    const { internId } = req.params

    const internExsit = await InternLOR.findById(internId)


    if(!internExsit) {
      throw new ApiError(400, "Intern not available")
    }


      const { pdfBuffer, fileName } = await generateLORService(internExsit)
      //  await sendLorViaEmail(internExsit.email, internExsit.name, pdfBuffer, fileName)


    return res.status(200).json(new ApiResponse(200, {},"intern have resend lor email"))

})





export {
  generateLOR, internRejectOfGenLor, internsWithLor,
  lorUpload,
  rejectedInternsOfLorGeneration, resendEmailOfLor, updateAndSendLor,uploadBulkInternsForLogGeneration
}
