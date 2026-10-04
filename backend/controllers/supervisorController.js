const db = require('../models')

const Supervisor = db.supervisors

var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

// Create Supervisor (admin-only in practice - only the admin dashboard calls this)
const createSupervisor = async (req, res) => {
  try {
    let { email, password, Cpassword, full_name, mobile, user_type_id, monitors_sector, aadhar_number } = req.body;

    if (password !== Cpassword) {
      return res.status(400).send({ message: "Password not match." });
    }

    const passwordHash = await bcrypt.hash(password, salt);

    const isAvailable = await Supervisor.findOne({ where: { email: email.toLowerCase() } });
    if (isAvailable) {
      return res.status(400).send({ message: "User already exists." });
    }
    const isAadharUsed = await Supervisor.findOne({ where: { aadhar_number: aadhar_number.toLowerCase() } });
    if (isAadharUsed) {
      return res.status(400).send({ message: "A supervisor with this aadhar number already exists." });
    }

    const supervisor = await Supervisor.create({
      email: email.toLowerCase(),
      password: passwordHash,
      full_name,
      aadhar_number,
      mobile,
      user_type_id,
      monitors_sector: monitors_sector || null,
    });

    const notification_id = `Supervisor${supervisor.supervisor_id}`;
    await supervisor.update({ notification_id });

    return res.status(200).json({ message: "Supervisor created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

async function getSupervisorDetails(req, res) {
  const id = req.params.id;
  let supervisor = await Supervisor.findOne({ where: { supervisor_id: id } });
  res.status(200).json({ supervisor });
}

async function getAllSupervisors(req, res) {
  let supervisors = await Supervisor.findAll();
  res.status(200).json({ supervisors });
}

async function deleteSupervisor(req, res) {
  let id = req.params.id;
  await Supervisor.destroy({ where: { supervisor_id: id } });
  res.status(200).json({ message: "Supervisor Deleted Successfully" });
}

async function updateSupervisorProfile(req, res) {
  let AID = req.body.aadhar_number;
  let supervisor = await Supervisor.update({ full_name: req.body.full_name, mobile: req.body.mobile }, { where: { aadhar_number: AID } });
  res.status(200).json({ supervisor });
}

module.exports = {
  createSupervisor,
  getSupervisorDetails,
  getAllSupervisors,
  deleteSupervisor,
  updateSupervisorProfile,
}
