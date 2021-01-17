import {Router} from "express";
import controllers from "./controllers";

const router = Router();

router.post("/create", controllers.create);

export default router;