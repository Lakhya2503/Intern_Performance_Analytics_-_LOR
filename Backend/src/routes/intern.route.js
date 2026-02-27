import Router from 'express';
import {
  addBulkInterns,
  addSignleIntern,
  eligibleInternsForLOR,
  getAllInters,
  scoringWiseRanking,
  updateBulkInterns,
  updateSingleIntern
} from '../controller/interns.controller.js';
import verifyJWT from '../middleware/auth.middleware.js';
import { uploadFIle } from '../middleware/multer.middleware.js';


const router = Router()

router.use(verifyJWT)


router.route('/bulk-upload/add').post(
    uploadFIle.fields(
        [{
             name : "bulkAddInterns",
              maxCount : 1
            }]
    ), addBulkInterns
)

router.route('/bulk-upload/update').post(
    uploadFIle.fields(
        [{
             name : "bulkUpdateInterns",
              maxCount : 1
            }]
    ), updateBulkInterns
)

router.route("/single-intern/add").post( addSignleIntern )

router.route("/single-intern/update/:internId").put( updateSingleIntern )

router.route("/interns-ranking").get( scoringWiseRanking )

router.route("/interns-lor-eligible").get( eligibleInternsForLOR )

router.route("/fetch/all-interns").get(getAllInters)

export default router;
