const db = require('../models')

// image Upload
const multer = require('multer')
const path =  require('path')

const fs = require('fs')
// create main Model

const User = db.users
const Complaint = db.complaints;

// Get All Users
async function getAllUsers(req,res) {
  const id = "2"
  let users = await User.findAll({where: {user_type_id: id}})
  res.status(200).json({users})
}

// Get  User Details
async function getUserDetails(req,res) {
  const id = req.params.id
  let user = await User.findAll({where: {user_id: id}})
  res.status(200).json({user})
}

// Get All Complaints
async function getAllComplaints(req,res) {
    let id =  req.params.id
    let complaints = await Complaint.findAll({ where: {user_id: id}})
    res.status(200).json({complaints})
}

// Get Single Complaint Details
async function getComplaintDetails(req,res) {
  let id =  req.params.id
  let complaint = await Complaint.findOne({ where: {complaint_id: id}})
  res.status(200).json({complaint})
}



// Update Profile
async function updateUserProfile(req,res) {
  let AID = req.body.aadhar_number;
  
  let user = await User.update({full_name:req.body.full_name,mobile:req.body.mobile}, { where: {aadhar_number:AID }})
  res.status(200).json({user})


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
   
}).single('userImage')


  


// for multiple images .array('images',3)

module.exports = {
  getAllComplaints,
  getComplaintDetails,
  getAllUsers,
  getUserDetails,
  updateUserProfile,
  upload
}