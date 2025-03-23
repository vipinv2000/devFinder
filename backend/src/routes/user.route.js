import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

import { acceptFollowRequest, addpost, getFeedPosts, getPendingRequests,requestFollow,getDevelopers ,searchtecStack, addStory, getStory,getDeveloperProfile, getAccountInteractions } from "../controllers/user.controller.js";




const router = express.Router();



router.post("/addpost",protectRoute,addpost);
router.post("/addStory",protectRoute,addStory);
router.patch("/requestFollow/:id",protectRoute,requestFollow);
router.get("/getPendingRequests",protectRoute,getPendingRequests);
router.patch("/acceptFollowRequest/:id",protectRoute,acceptFollowRequest);
router.get("/getFeedPosts",protectRoute,getFeedPosts);
router.get("/getStory",protectRoute,getStory);


router.get("/getDevelopers",protectRoute,getDevelopers)
router.get("/searchtecStack/:searchkey",searchtecStack)
router.get("/getDeveloperProfile/:devId",protectRoute,getDeveloperProfile)
router.get("/getAccountInteractions",protectRoute,getAccountInteractions)



export default router;
