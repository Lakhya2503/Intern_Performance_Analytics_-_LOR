import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'
import Intern from '../model/interns.model.js'
import parseFileToJson from '../parser/parseInternsData.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import { internsFieldsEnum } from '../utils/constant.js'
import { calculateAverageScore, castValue, getChangeFiled } from '../utils/helper.js'

const addBulkInterns = asyncHandler(async (req, res) => {
    const file = req.files?.bulkAddInterns[0];
    const user = req.user;

    if (!user.isAuthorized) {
        throw new ApiError(404, "Unauthorized request");
    }

    if (!file) {
        throw new ApiError(404, "Interns file doesn't exist");
    }

    const extension = path.extname(file.originalname);
    const data = await parseFileToJson(extension, file.path);

    if (!data) {
        throw new ApiError(500, "Something went wrong when parsing interns data");
    }

    const newInternFromClient = [];
    const alreadyExistInternsOnServer = [];
    const notValidData = [];

    const allInternsId = data.map(i => i.intern_id);
    const existingInterns = await Intern.find({ _id: { $in: allInternsId } }).select('_id');
    const existingInternIdSet = new Set(existingInterns.map(i => i._id.toString()));

    for (const newIntern of data) {
        const finalScore = calculateAverageScore(newIntern);

        const {
            intern_id = "",
            name = "",
            gender = "",
            course = "",
            email = "",
            endDate = "",
            department = "",
            mentor = "",
            active = ""
        } = newIntern;

        const emptyFields = [intern_id, name, gender, course, email, endDate, department, mentor, active]
            .filter(field => field === null || field === undefined || String(field).trim() === "");

        if (emptyFields.length > 0) {
            notValidData.push({ intern: newIntern, missingFields: emptyFields });
            continue;
        }

        if (existingInternIdSet.has(intern_id)) {
            alreadyExistInternsOnServer.push(newIntern);
            continue;
        }

        let endDateObj = new Date(endDate);
        if (isNaN(endDateObj)) endDateObj = null;

        newInternFromClient.push({
            _id: intern_id,
            name,
            gender,
            course,
            email,
            endDate: endDateObj,
            department,
            mentor,
            score: Number(finalScore),
            isActive: Boolean(active)
        });
    }

    let insertedInterns = [];
    if (newInternFromClient.length > 0) {
        insertedInterns = await Intern.insertMany(newInternFromClient, { ordered: false });
    }

    newInternFromClient.forEach(item => console.log(item));

    return res.status(200).json(new ApiResponse(200, {
        newInternFromClient,
        alreadyExistInternsOnServer,
        notValidData
    }, "Added Bulk interns successfully"));
});

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
    const { name, gender, course , email, endDate, department, mentor, score, isActive} = req.body

      const allFields =  [name, gender, course , email, department, mentor]

      // console.log( name, gender, course , email, endDate, department, mentor, score, isActive);



      if(allFields.some(item => item.trim() === "")){
        throw new ApiError(400, "All fields are required")
      }

      const intern = await Intern.create({
          _id :  req.body._id ? req.body._id : new mongoose.Types.ObjectId(),
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

const getAllInters = asyncHandler(async(req,res)=>{

  const allInters = await Intern.find().lean()

  return res.status(200).json(new ApiResponse(200, allInters, "All interns fetch Successfully"))

})

const scoringWiseRanking = asyncHandler(async(req,res) => {

    const goldInterns = await Intern.find(
          { score : {$gte : 85}}
    )

    const silverInterns = await Intern.find(
        { score : { $gte : 75, $lt : 85 } }
    )

    const bronzeInterns = await Intern.find(
        { score : { $lt : 75 } }
    )
      return res.status(200).json(new ApiResponse(200, {
          gold : goldInterns,
          silver : silverInterns,
          bronze : bronzeInterns
      }, "Ranking fetch"))
})

const eligibleInternsForLOR = asyncHandler(async(req,res)=>{

        const filteredInterns = await Intern.aggregate([
              {
                $match: {
                  isCompliantIssue: false,
                  isDisciplineIssue: false,
                  score: { $gte: 75, $lt: 85 }
                }
              },
              {
                $lookup: {
                  from: "internlors",
                  localField: "email",
                  foreignField: "email",
                  as: "lor"
                }
              },
              {
                $match: {
                  lor: { $size: 0 }
                }
              }
            ]);



        // console.log(filteredInterns);

    return res.status(200).json(new ApiResponse(200, filteredInterns, "Eligible interns for LOR Generation"))

})

const internWIthNoLor = asyncHandler(async(req,res)=>{

          const filteredInterns = await Intern.aggregate([
                        {
                          $match: {
                            isCompliantIssue: false,
                            isDisciplineIssue: false,
                          }
                        },
                        {
                          $lookup: {
                            from: "internlors",
                            localField: "email",
                            foreignField: "email",
                            as: "lor"
                          }
                        },
                        {
                          $match: {
                            lor: { $size: 0 }
                          }
                        }
                      ]);

          // console.log(filteredInterns);

            return res.status(200).json(new ApiResponse(200, filteredInterns, "interns with no lor"))
})




  export {
  addBulkInterns,
  addSignleIntern,
  eligibleInternsForLOR,
  getAllInters, internWIthNoLor, scoringWiseRanking,
  updateBulkInterns,
  updateSingleIntern
}
