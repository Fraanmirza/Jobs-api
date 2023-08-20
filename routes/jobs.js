const express = require("express");
const router = express.Router();

const {
  getAlljobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

//router.get("/", getAlljobs);
// router.post('/',createJob);
// router.get('/:id',getJob);
// router.patch('/:id', updateJob);
// router.delete('/:id', deleteJob);

router.route("/").post(createJob).get(getAlljobs);

router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
