import express from "express";
import * as controller from '../controllers/messageController.js';
import protectRoute from "../middleware/protectRoute.js";
import multer from "multer";
import getMulterStorage from "../helpers/getMulterStorage.js";

const storage = getMulterStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/:customer_id", protectRoute, controller.get);
router.post("/", protectRoute, upload.array('files'), controller.create);
router.post("/leadvertex", protectRoute, controller.leadvertexCreate);
router.post("/cache", controller.cache);
router.post("/reply", controller.reply);

export default router;
