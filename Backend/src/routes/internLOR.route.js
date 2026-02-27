import { Router } from "express";
import { generateLOR, internsWithLor, lorUpload, rejectedInternsForLorGeneration, updateAndSendLor } from '../controller/InternLOR.controller.js';
import verifyJWT from "../middleware/auth.middleware.js";
import { uploadLorTemp } from "../middleware/multer.middleware.js";


const router = Router()

router.use(verifyJWT)

router.route("/upload-lor-temp").post(uploadLorTemp.fields(
    [{
        name : "lorTemp",
        maxCount : 1
    }]
),lorUpload)

router.route('/lor-generate/:internId').post(generateLOR)

router.route("/fetch/inters-with-lor").get(internsWithLor)

router.route("/fetch/rejected-intern-lor/generation").get(rejectedInternsForLorGeneration)

router.route('/update/send-lor/:internLorId').put(updateAndSendLor)


export default router
