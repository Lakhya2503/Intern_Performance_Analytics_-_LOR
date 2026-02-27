  import fs from 'fs'
import multer from 'multer'
import path from 'path'
import ApiError from '../utils/ApiError.js'

const publicDir = path.join(process.cwd(), "public")
const imageDir = path.join(publicDir, "images")
const fileDir = path.join(publicDir, "files")
const lorTempDir = path.join(publicDir, "lorTemplate");

    [publicDir, imageDir, fileDir, lorTempDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    })


  const fileStorege = multer.diskStorage({
    destination  : function(req,file,cb){
      cb(null, fileDir)
    },

    filename : function (req,file,cb) {
        const uniqueSuffix = Date.now()+ "-" + Math.round(Math.random() * 1e9)

        const cleanName = file.originalname.replace(/\s+/g, "_");

        cb(null, `${uniqueSuffix}-${cleanName}`)
    }
  })


  const imageStorage = multer.diskStorage({
    destination  : function(req,file,cb){
      cb(null, imageDir)
    },

    filename : function (req,file,cb) {
        const uniqueSuffix = Date.now()+ "-" + Math.round(Math.random() * 1e9)

        const cleanName = file.originalname.replace(/\s+/g, "_");

        cb(null, `${uniqueSuffix}-${cleanName}`)
    }
  })

  const lorTempStorege = multer.diskStorage({
    destination : function(req,file,cb){
      cb(null, lorTempDir)
    },

      filename : function (req,file,cb) {

        const cleanName = file.originalname.replace(/\s+/g, "_");

          cb(null,  cleanName)
      }

  })


  const fileFilter = (req,file,cb) =>{
      const allowedType = [
        "text/csv",
        "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]

      if(allowedType.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(new ApiError(401, "Only CSV and Excel files are allowed"),false)
      }
  };

  export const uploadFIle = multer({
      storage : fileStorege,
      fileFilter,
      limits : {
        fileSize : 5 * 1024 * 1024
      }
  })

  export const uploadImage = multer({
      storage : imageStorage,
      limits : {
        fileSize : 2 * 1024 * 1024
      }
  })

  export const uploadLorTemp = multer({
    storage : lorTempStorege,
    limits : {
       fileSize : 6 *1024 * 1024
    }
  })
