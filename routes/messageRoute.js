import express from "express";
import * as controller from '../controllers/messageController.js';
import protectRoute from "../middleware/protectRoute.js";
import multer from "multer";
import getMulterStorage from "../helpers/getMulterStorage.js";

const storage = getMulterStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/:conversation_id", protectRoute, controller.get);
router.post("/:conversation_id", protectRoute, upload.array('files'), controller.create);

export default router;