import fs from 'fs'
import path from 'path'
import Intern from '../model/interns.model.js'
import parseFileToJson from '../parser/parseInternsData.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import { internsFieldsEnum } from '../utils/constant.js'
import { castValue, getChangeFiled } from '../utils/helper.js'

const addBulkInterns = asyncHandler(async(req,res)=>{
    const file = req.files?.bulkAddInterns[0]

    if(!file) {
      throw new ApiError(404, "Inters file doesn't exists")
    }

    const extension = path.extname(file.originalname)

    const data = await parseFileToJson(extension, file.path)

    if(!data) {
      throw new ApiError(500, "something wen't wrong when parsing interns data")
    }



    const formattedInternsData = data.map(intern => ({
        _id : intern.intern_id,
        name : intern.name,
        gender : intern.gender,
        course : intern.course ,
        email : intern.email.text,
        endDate :  Date(intern.endDate) || NaN,
        department : intern.department ,
        mentor : intern.mentor,
        score : Number(intern.score) || 0,
        isActive : Boolean(intern.active)
    }))


    const bulkInterns = await Intern.insertMany(formattedInternsData)

    return res.status(200).json(new ApiResponse(200, bulkInterns, "Add Bulk interns Successfully"))
})

const updateBulkInterns = asyncHandler(async(req,res)=>{


      const file = req.files?.bulkUpdateInterns[0]

       if(!file) {
         throw new ApiError(404, "Inters file doesn't exists")
       }

    const extension = path.extname(file.originalname)

    const oldInters = await Intern.find().lean()
    const newInters = await parseFileToJson(extension, file.path)


    const dbMap = new Map(
        oldInters.map(intern => [intern.email, intern])
     )



     const bulkUpdates = [];
     const updateInternsLog = [];

     for(const uploadIntern of newInters) {
       const dbInterns = dbMap.get(uploadIntern.email.text);



       if(!dbInterns) continue;



        const changes = getChangeFiled(dbInterns,uploadIntern, internsFieldsEnum)

       console.log(changes);

        if(Object.keys(changes).length > 0) {
            bulkUpdates.push({
                updateOne: {
                    filter : { email : uploadIntern.email.text},
                    update : { $set : changes }
                }
            })

            updateInternsLog.push({
              email : uploadIntern.email.text,
              name : dbInterns.name,
              oldValue : Object.fromEntries(
                  Object.keys(changes).map(k => [k, dbInterns[k]])
              ),
              newValue : changes
            })

        }
     }

     if(bulkUpdates.length > 0) {
          await Intern.bulkWrite(bulkUpdates)
    }

    await fs.promises.unlink(file.path).catch(() => {});

    // console.log(bulkUpdates);


    return res
    .status(200)
    .json(new ApiResponse(200, {
        updateCount : updateInternsLog.length,
        updateInterns : updateInternsLog
    }, "interns update successfully"))

})

const addSignleIntern = asyncHandler(async(req,res)=>{
    const {_id,  name, gender, course , email, endDate, department, mentor, score, isActive} = req.body

      const allFields =  [_id,  name, gender, course , email, department, mentor]


      if(allFields.some(item => item.trim() === "")){
        throw new ApiError(400, "All fields are required")
      }

      const intern = await Intern.create({
          _id,
          name,
          gender,
          course ,
          email,
          endDate,
          department,
          mentor,
          score,
          isActive
      })

      return res.status(200).json(new ApiResponse(200, intern, `${intern.name} create successfully`))
})

const updateSingleIntern = asyncHandler(async(req,res)=>{
      const { internId } =  req.params

      const updates = {}

      Object.keys(req.body).forEach((key)=>{
        const fieldType = internsFieldsEnum[key]


          if(!fieldType) return

          const castedValue = castValue(req.body[key], fieldType)


          if(castedValue === null) {
             throw new ApiError(400, `Invalide value for ${key}`)
          }

          updates[key] = castedValue
      })

      if(Object.keys(updates).length === 0) {
           throw new ApiError(400, "No valide fields provided for updates")
      }

      const updateIntern = await Intern.findByIdAndUpdate(
          internId,
          {$set : updates},
          {
              new  : true,
              runValidators : true
          }
      )

      if(!updateIntern) {
        throw new ApiError(400, "Intern not found")
      }

      return res.status(200).json(new ApiResponse(200, "updateIntern", "update Inter successfully"))
})




  export {
  addBulkInterns,
  addSignleIntern,
  updateBulkInterns,
  updateSingleIntern
}
