import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createJob, getAdminJobs, getAllJobs, getJobById, updateJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route('/post').post(isAuthenticated,createJob);
router.route('/get').get(isAuthenticated,getAllJobs);
router.route('/admin/jobs').get(isAuthenticated,getAdminJobs);
router.route('/get/:id').get(isAuthenticated,getJobById);
router.route('/update/:id').put(isAuthenticated,updateJob);

export default router;