import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { deleteMessage, getAllMessagesForMentor, getMessage, getSendMessage, replayOfSender, sendMessage } from "../controller/contact.controller.js";

const router = Router()

router.use(verifyJWT)

router.route('/send-message').post(sendMessage)

router.route('/fetch/pending-message').get(getAllMessagesForMentor)

router.route('/send/replied-message/:senderId').post(replayOfSender)

router.route('/fetch/replied-message').get(getMessage)

router.route('/fetch/mentor-replay/messages').get(getSendMessage)

router.route('/delete/message/:messagId').delete(deleteMessage)



export default router;
