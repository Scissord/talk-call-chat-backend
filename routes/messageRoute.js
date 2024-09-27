import express from "express";
import * as controller from '../controllers/messageController.js';
import protectRoute from "../middleware/protectRoute.js";
import multer from "multer";
import getMulterStorage from "../helpers/getMulterStorage.js";

const storage = getMulterStorage();
const upload = multer({ storage });

const router = express.Router();

// Получить переписку
router.get("/:customer_id", protectRoute, controller.get);
// Написать в чате
router.post("/", protectRoute, upload.array('files'), controller.create);
// Написать по номеру
router.post("/leadvertex", protectRoute, controller.leadvertexCreate);
// Переправить сообщение
router.post("/reply", protectRoute, controller.reply);
// Удалить непрочитанные
router.post("/clear", protectRoute, controller.clear);
// Занести в кэш
router.post("/cache", controller.cache);

export default router;
