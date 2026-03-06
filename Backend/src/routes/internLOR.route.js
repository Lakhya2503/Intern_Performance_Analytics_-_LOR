import { Router } from "express";
import { generateLOR,internRejectOfGenLor, internsWithLor, rejectedInternsOfLorGeneration, resendEmailOfLor, shortListedInternsSelectAndGenLor, updateAndSendLor, uploadBulkInternsForLogGeneration, uploadLorTemplate } from '../controller/InternLOR.controller.js';
import verifyJWT from "../middleware/auth.middleware.js";
import { uploadFile, uploadLorTemp } from "../middleware/multer.middleware.js";

const router = Router()

router.use(verifyJWT)

router.route("/upload-lor-temp").post(uploadLorTemp.fields(
    [{
        name : "lorTemp",
        maxCount : 1
    }]
),uploadLorTemplate)

router.route('/lor-generate/:internId').post(generateLOR)

router.route("/fetch/rejected-intern-lor").get(rejectedInternsOfLorGeneration)

router.route('/update/send-lor/:internLorId').put(updateAndSendLor)

router.route("/fetch/interns-with-lor").get(internsWithLor)

router.route("/resend/lor-email/:internId").post(resendEmailOfLor)

router.route("/reject/intern/lor-gen/:internId").post(internRejectOfGenLor)


router.route("/select/gen/lor").post(shortListedInternsSelectAndGenLor)

router
    .route("/bulk-upload/interns/lor-gen").post(uploadFile.fields(
    [{
        name : "bulkInternOfLorGen",
        maxCount : 1
    }]
),uploadBulkInternsForLogGeneration)



export default router
