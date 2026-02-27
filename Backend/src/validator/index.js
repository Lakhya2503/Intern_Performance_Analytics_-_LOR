import { body, param } from 'express-validator'
import { userRolesEnum } from '../utils/constant.js'

const userRegisterValidator = () => {
  return [
      body("email")
          .trim()
          .notEmpty()
          .withMessage("Email is required")
          .isEmail()
          .withMessage("Email invalid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("username is required")
            .isLength({min : 3})
            .withMessage("username must be at least 3 characters long"),
          body("password")
            .trim()
            .notEmpty()
            .withMessage("password is required"),
          body("role")
            .isEmpty()
            .withMessage("role are required")
            .isIn(userRolesEnum)
            .withMessage("Invalid user role")
  ]
}

const userLoginValidator = () => {
  return [
      body("email")
        .optional()
        .isEmail()
        .withMessage("Email is invalid"),
      body("username")
        .optional(),
      body("password")
      .notEmpty()
      .withMessage("password is required"),
       body("role")
            .isEmpty()
            .withMessage("role are required")
            .isIn(userRolesEnum)
            .withMessage("Invalid user role")
  ]
}

const userChangeCurrentPassword = () => {
  return [
      body("newPassword").isEmpty().withMessage("new password is required"),
      body("oldPassword").isEmpty().withMessage("old password is required")
  ]
}

const addIntern = () => {
    return [
        body("name").isEmpty().withMessage("name is required"),
        body("gender").optional(),
        body("course").isEmpty().withMessage("course is required"),
        body("endDate").optional(),
        body("department").isEmpty().withMessage("department is required"),
        body("mentorName").isEmpty().withMessage("mentorName is required"),
        body("score").optional()
    ]
}

const updateIntern = () => {
    return [
        body("name").isEmpty().withMessage("name is required"),
        body("gender").optional(),
        body("course").isEmpty().withMessage("course is required"),
        body("endDate").optional(),
        body("department").isEmpty().withMessage("department is required"),
        body("mentorName").isEmpty().withMessage("mentorName is required"),
        body("score").isEmpty().withMessage("score is required"),
    ]
}

const finalUpdateIntern = () => {
    return [
        body("name").isEmpty().withMessage("name is required"),
        body("gender").optional(),
        body("course").isEmpty().withMessage("course is required"),
        body("endDate").isEmpty().withMessage("end is required"),
        body("department").isEmpty().withMessage("department is required"),
        body("mentorName").isEmpty().withMessage("mentorName is required"),
        body("score").isEmpty().withMessage("score is required"),
    ]
}


export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPassword,
  addIntern,
  updateIntern,
  finalUpdateIntern
}
