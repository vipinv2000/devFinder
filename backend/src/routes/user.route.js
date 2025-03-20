import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { acceptFollowRequest, addpost, getFeedPosts, getPendingRequests, requestFollow } from "../controllers/user.controller.js";



const router = express.Router();



router.post("/addpost",protectRoute,addpost);
router.patch("/requestFollow/:id",protectRoute,requestFollow);
router.get("/getPendingRequests",protectRoute,getPendingRequests);
router.patch("/acceptFollowRequest/:id",protectRoute,acceptFollowRequest);
router.get("/getFeedPosts",protectRoute,getFeedPosts);




export default router;
