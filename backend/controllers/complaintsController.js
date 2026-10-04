const db = require('../models')

// image Upload
const multer = require('multer')
const path =  require('path')

const fs = require('fs')

const { classifyCaseLevel } = require('../services/caseLevelClassifier')
const { pickOfficer } = require('../services/agentAssignment')

const User = db.users;
const Complaint = db.complaints;
const Agent = db.agents;

// Register Complaint. Claude assesses how urgent the complaint is (case_level),
// then it's routed to the officer whose rank best matches that level (see
// services/agentAssignment.js) rather than simply the least-loaded officer.
async function registerComplaint(req,res) {
  const agents = await Agent.findAll({ where: { agent_sector: req.body.sector } });
  if (agents.length === 0) {
    return res.status(400).send({ message: "No agents available for this sector." });
  }

  const case_level = await classifyCaseLevel({
    sector: req.body.sector,
    notes: req.body.notes,
    complaint_address: req.body.complaint_address,
  });
  const agent = pickOfficer(agents, case_level);

  const randomDigits = Math.random().toString().substr(2, 4); // Generate 4 random digits
  const complaint_id = `SRV${randomDigits}AB`; // Construct the ID

  const complaintData = {
    complaint_id,
    pdfComplaint: req.file ? req.file.path : '',
    user_id: req.body.user_id,
    sector: req.body.sector,
    complaint_address: req.body.complaint_address,
    complaint_pincode: req.body.complaint_pincode,
    notes: req.body.notes,
    case_level,
    agent_id: agent.agent_id,
    status: agents.length === 1 ? (req.body.status || 'pending') : 'pending',
  };

  const complaint = await Complaint.create(complaintData);
  agent.users_assigned.push(complaint);
  await Agent.update({ users_assigned: agent.users_assigned }, { where: { agent_id: agent.agent_id } });

  return res.json({ agentAssigned: agent.agent_id, case_level });
}

// Get All Complaints
async function getAllComplaints(req,res) {
    let complaints = await Complaint.findAll()
    res.status(200).json({complaints})
}


// Upload Images

const storage=multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdir('./uploads/',(err)=>{
           cb(null, './uploads/');
        });
      },
      filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + path.extname(file.originalname));
      }
})


const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000'},
   
}).single('pdfComplaint')

module.exports = {
    registerComplaint,
    getAllComplaints,
    upload
}