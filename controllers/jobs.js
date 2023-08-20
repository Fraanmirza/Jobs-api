const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors/");
const { StatusCodes } = require("http-status-codes");

const getAlljobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  //console.log(userId, jobId);
  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`no job with id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  const {
    user: { userId },
    body: { company, position },
  } = req;

  if (company === "" || position === "") {
    throw new BadRequestError("please provide company and position");
  }
  const job = await Job.create({ createdBy: userId, company, position });
  if (!job) {
    throw new NotFoundError(`no job with id: ${jobId}`);
  }
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError("please provide company and position");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, position },
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`no job with id: ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`no job with id: ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAlljobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
