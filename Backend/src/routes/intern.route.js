import Router from 'express';
import {
  addBulkInterns,
  addSignleIntern,
  getAllInters,
  internWIthNoLor,
  scoringWiseRanking,
  shortlistedWithNoLor,
  updateBulkInterns,
  updateSingleIntern
} from '../controller/interns.controller.js';
import verifyJWT from '../middleware/auth.middleware.js';
import { uploadFile } from '../middleware/multer.middleware.js';


const router = Router()

router.use(verifyJWT)


router.route('/bulk-upload/add').post(
    uploadFile.fields(
        [{
             name : "bulkAddInterns",
              maxCount : 1
            }]
    ), addBulkInterns
)

router.route('/bulk-upload/update').post(
    uploadFile.fields(
        [{
             name : "bulkUpdateInterns",
              maxCount : 1
            }]
    ), updateBulkInterns
)

router.route("/single-intern/add").post( addSignleIntern )

router.route("/single-intern/update/:internId").put( updateSingleIntern )

router.route("/interns-ranking").get( scoringWiseRanking )

router.route("/interns-lor-eligible").get( shortlistedWithNoLor )

router.route("/interns-with-no-lor").get( internWIthNoLor)


router.route("/fetch/all-interns").get(getAllInters)

export default router;
