import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {login,register,updateProfile,logout} from "../controllers/user.controller.js"

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/profile/update').post(isAuthenticated,updateProfile);
router.route('/profile/logout').get(isAuthenticated,logout);

export default router;