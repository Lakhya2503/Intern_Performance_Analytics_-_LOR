import Router from 'express'
import {
  fetchAllExcutionTemMembers,
  fetchUser,
  isAuthorizationChanged,
  loggedInUser,
  loggedOutUser,
  registerUser,
  updateAvatar,
  updateProfileFileds
} from '../controller/user.controller.js'
import verifyJWT from '../middleware/auth.middleware.js'
import { uploadImage } from '../middleware/multer.middleware.js'
import { userLoginValidator, userRegisterValidator } from '../validator/index.js'

const router = Router()

router.route("/auth/register").post(userRegisterValidator(), registerUser)

router.route("/auth/logged-in").post(userLoginValidator(), loggedInUser)

router.route("/auth/logged-out").post(verifyJWT, loggedOutUser)

router.route("/auth/fetch-user").get(verifyJWT, fetchUser)

router.route("/auth/update-user-profile").post(verifyJWT, updateProfileFileds)

router.route("/auth/update-user-profile-avatar").post(uploadImage.fields(
  [{
             name : "avatar",
             maxCount : 1
            }]
          ), verifyJWT, updateAvatar)


router.route("/auth/update-authorization/:excustionTeamId").post(verifyJWT, isAuthorizationChanged)

router.route("/auth/fetch-execution-team").get(verifyJWT, fetchAllExcutionTemMembers)


export default router
