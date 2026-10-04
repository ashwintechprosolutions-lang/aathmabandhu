const db = require('../models')

// create main Model
const User = db.users
const Agent = db.agents
const Complaint = db.complaints

// Hash Password
var bcrypt = require('bcryptjs');
var salt =  bcrypt.genSaltSync(10);


const createAgent = async (req, res) => {
    try {
      let { email, password, Cpassword, full_name, mobile, user_type_id,agent_sector,aadhar_number, officer_level} = req.body;
  
      if (password !== Cpassword) {
        return res.status(400).send({ message: "Password not match." });
      }
  
      // Encrypt the password
      const passwordHash = await bcrypt.hash(password, salt);
  
      // Check if the user already exists
      const isAvailable = await Agent.findOne({
        where: { email: email.toLowerCase() },
      });

      const isAadharUsed = await Agent.findOne({
        where: { aadhar_number: aadhar_number.toLowerCase() },
      });
  
      if (isAvailable) {
        return res.status(400).send({ message: "User already exists." });
      }
      if (isAadharUsed) {
        return res.status(400).send({ message: "An agent with this aadhar number already exists." });
      }
  

      // Generate notification_id based on Admin+user_id
      const agent = await Agent.create({
        email: email.toLowerCase(),
        password: passwordHash,
        full_name: full_name,
        aadhar_number: aadhar_number,
        mobile: mobile,
        user_type_id: user_type_id,
        agent_sector: agent_sector,
        officer_level: ['Junior', 'Senior', 'Lead'].includes(officer_level) ? officer_level : 'Junior'
      });
  
      // Update the user with the generated notification_id
   if(user_type_id === 3){
        const notification_id = `Agent${agent.agent_id}`;
      await agent.update({ notification_id });
  
      return res.status(200).json({ message: "Agent created successfully." });
      }
      
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // Get Single Agent
async function getAgentDetails(req,res) {
  const id = req.params.id
  let agent = await Agent.findOne({where:{agent_id:id}})
  res.status(200).json({agent})
}
// Get All Agents
async function getAllAgents(req,res) {
    const id = '3'
    let agents = await Agent.findAll()
    res.status(200).json({agents})
}

// Get Complaints of Agent
async function getAgentComplaints(req,res) {
    const id = req.params.id
    let agent = await Agent.findOne({ where: {agent_id: id}})
    res.status(200).json({agent})
}


// Change Compalint Status and Assign Agent to User
async function changeStatus(req,res) {
  const {complaint_id,agent_id,user_id,status} = req.body;

  if(status === "completed"){
    console.log("thisss")
    const complaint = await Complaint.findOne({where:{complaint_id:complaint_id}});
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
  // Remove the completed complaint from the agent's list
  const agent = await Agent.findOne({where:{agent_id:complaint.agent_id}});
  if (agent) {
    // console.log(agent.users_assigned ,"1st")
    agent.users_assigned = agent.users_assigned.filter(c => c.complaint_id !== complaint.complaint_id);
    // console.log(agent.users_assigned ,"2nd")
    await Agent.update({users_assigned:agent.users_assigned}, { where: {agent_id: agent.agent_id }})
    // res.json(info);
  }
   
  // Delete the complaint from complaints
  await Complaint.destroy({where:{complaint_id:complaint_id}});
  res.status(200).send("Notification Deleted");
  }
  else{

    let complaintData = await Complaint.findOne({ where: {complaint_id: complaint_id}})
    let agentData = await Agent.findOne({ where: {agent_id: agent_id}})
  
    //just update the status of complaint
    const updatedComplaint = await complaintData.update({ status,agent_id });
  

  
    //add the complaint to users assigned of agent
    if(agentData.users_assigned == null){
      const needed = []
      needed.push(updatedComplaint)
  
       await Agent.update({users_assigned:needed}, { where: {agent_id: agent_id }})
       res.status(200).json({ message: "Added complaint to agent complaint list" });
     }
     else{
          //update the complaints list if complaint is already present
          agentData.users_assigned.map((data)=>{
          if(data.complaint_id === complaint_id){
            data.status = status
          }
          else{
            agentData.users_assigned.push(updatedComplaint)
          }
          })
  
         await Agent.update({users_assigned:agentData.users_assigned}, { where: {agent_id: agent_id }})
         res.status(200).json({ message: "Added complaint to agent complaint list" });
        }
  }
  
  
}

async function deleteAgent(req,res) {
  let id = req.params.id

  try {
    // 1. Fetch the agent and their complaints
    
    let agent = await Agent.findOne({where:{agent_id:id}})
    console.log(agent,id)
    const assignedComplaints = agent.users_assigned;

    // 2. Check if the agent has any assigned complaints
    if (assignedComplaints.length === 0) {
      // No complaints, delete the agent directly
      await Agent.destroy({where:{agent_id:id}});

      return res.status(200).json({message: "Agent Deleted Successfully" });

    }

    // 3. Find other agents in the same sector
    const otherAgentsInSector = await Agent.findAll({where:{ agent_sector: agent.agent_sector }});

    // 4. Handle cases where no other agents are available
    if (otherAgentsInSector.length === 1) {
      return res.status(400).send({ message: "No agents are there from this sector to take the pending complaints." });
    }
   let AgentIdJson = []
    // 5. Distribute complaints to agents with the least complaints
    for (const complaint of assignedComplaints) {
      const agentWithLeastComplaints = otherAgentsInSector.reduce((minAgent, currentAgent) => {
        return currentAgent.users_assigned.length < minAgent.users_assigned.length
          ? currentAgent
          : minAgent;
      }, otherAgentsInSector[0]); // Initialize with the first agent

      agentWithLeastComplaints.users_assigned.push(complaint);
      await Agent.update({ users_assigned: agentWithLeastComplaints.users_assigned }, { where: { agent_id: agentWithLeastComplaints.agent_id } });
      AgentIdJson.push(agentWithLeastComplaints.agent_id)

    }

    // 6. Delete the original agent
    await Agent.destroy({where:{agent_id:id}});
    res.status(200).json({id:AgentIdJson,message: `Agent ${id} deleted and complaints redistributed.` });

  } catch (error) {
    console.error(`Error deleting agent: ${error.message}`);
    throw error; // Rethrow to allow further handling
  }
}


// Update Profile
async function updateAgentProfile(req,res) {
  let AID = req.body.aadhar_number;
  
  let agent = await Agent.update({full_name:req.body.full_name,mobile:req.body.mobile}, { where: {aadhar_number:AID }})
  res.status(200).json({agent})


}
  module.exports = {
    createAgent,
    getAgentDetails,
    getAllAgents,
    getAgentComplaints,
    changeStatus,
    updateAgentProfile,
    deleteAgent
}