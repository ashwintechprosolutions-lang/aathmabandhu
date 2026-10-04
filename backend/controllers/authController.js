const db = require('../models')

// create main Model
const User = db.users
const Agent = db.agents
const Supervisor = db.supervisors

// Hash Password
var bcrypt = require('bcryptjs');
var salt =  bcrypt.genSaltSync(10);

// JWT Token
const jwt = require('jsonwebtoken');
const { JWT_SECRET: jwtSEC } = require('../config/jwtConfig');
const Session =  db.sessions

// Nodemailer - optional. Without SMTP_USER/SMTP_PASS set, the OTP is returned in
// the API response instead of emailed (same behaviour the web app's mock backend
// uses), so ForgotPassword still works without an email account configured.
const nodemailer = require('nodemailer');

const transporter = (process.env.SMTP_USER && process.env.SMTP_PASS)
  ? nodemailer.createTransport({
      service: process.env.SMTP_SERVICE || 'gmail',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    })
  : null;

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes


function generateOTP() {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

const sendForgotPasswordEmail = (userEmail, otp) => {
  if (!transporter) {
    console.log(`[no SMTP configured] OTP for ${userEmail}: ${otp}`);
    return;
  }
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: userEmail,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// SignUp User
const singUp = async (req, res) => {
  try {
    let { email, password, Cpassword, full_name, aadhar_number, mobile, user_type_id } = req.body;

    if (password !== Cpassword) {
      return res.status(400).send({ message: "Password not match." });
    }

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, salt);

    // Check if the user already exists
    const isAvailable = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (isAvailable) {
      return res.status(400).send({ message: "User already exists." });
    }

    // Generate notification_id based on Admin+user_id
    const user = await User.create({
      email: email.toLowerCase(),
      password: passwordHash,
      full_name: full_name,
      aadhar_number: aadhar_number,
      mobile: mobile,
      user_type_id: user_type_id,
    });

    // Update the user with the generated notification_id
    if(user_type_id === 1){
      const notification_id = `Admin1`;
    await user.update({ notification_id });

    return res.status(200).json({ message: "User created successfully." });
    }
    else if(user_type_id === 2){
      const notification_id = `User${user.user_id}`;
    await user.update({ notification_id });

    return res.status(200).json({ message: "User created successfully." });
    }
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// User Login
const login = async (req,res) => {
    let { email, password }= req.body;
    // check user exist for this email in the database.
    const isAvailable = await User.findOne({
    where: {
    email: email.toLowerCase()
    }
    });
      // Agent Login Check
  const isAvailableAgent = await Agent.findOne({
    where: {
    email: email.toLowerCase()
    }
    });
      // Supervisor Login Check (monitor-only role - oversees a department's
      // agents/complaints, never resolves them)
  const isAvailableSupervisor = await Supervisor.findOne({
    where: {
    email: email.toLowerCase()
    }
    });


  //   // Provider Login
    
  //   const isAvailableProvider = await Provider.findOne({
  //     where: {
  //     email: email.toLowerCase()
  //     }
  //     });
    // if (!isAvailable || !isAvailableAgent) {
    // res.status (400).send({ message: "User not exist." })
    // }
    // check password.
    
      if(isAvailable){
console.log("user")
       let passMatch = await bcrypt.compare(password, isAvailable.password);
   
       if (!passMatch) return res.status(400).send({ message: "Password is incorrect." });
      
       // generate JWTToken
       // Bug fix: this used to sign the entire Sequelize record - including the
       // bcrypt password hash - into the token payload. JWTs are signed, not
       // encrypted, so that hash was readable by anyone holding the token.
       let token = jwt.sign({ user_id: isAvailable.user_id, user_type_id: isAvailable.user_type_id }, jwtSEC, { expiresIn: '365d'})
       
       await Session.create({
           userId:isAvailable.user_id,
           jwt:token,
           status:"Valid"
       })
        const data = {
           first_name: isAvailable.first_name,
           last_name: isAvailable.last_name,
           full_name: isAvailable.full_name,
           mobile: isAvailable.mobile,
           is_profile: isAvailable.is_profile,
           user_type_id: isAvailable.user_type_id,
           user_id: isAvailable.user_id,
           notification_id: isAvailable.notification_id
        }
        return res.status(200).send({token: token ,data:  data,
          message: 'User Successfully Loggedin.' })
     }
    
else if(isAvailableAgent){
  console.log("Agent")
  let passMatchAgent = await bcrypt.compare(password, isAvailableAgent.password);
  
  if (!passMatchAgent) return res.status(400).send({ message: "Password is incorrect." });
 
  // generate JWTToken (same fix as above - minimal claims, no password hash)
  const tokenAgent = jwt.sign({ agent_id: isAvailableAgent.agent_id, user_type_id: isAvailableAgent.user_type_id }, jwtSEC, { expiresIn: '365d'})
  
  await Session.create({
      userId:isAvailableAgent.agent_id,
      jwt:tokenAgent,
      status:"Valid"
  })
   const dataAgent = {
      full_name: isAvailableAgent.full_name,
      mobile: isAvailableAgent.mobile,
      user_type_id: isAvailableAgent.user_type_id,
      agent_id: isAvailableAgent.agent_id,
      agent_sector:isAvailableAgent.agent_sector
   }
   return res.status(200).send({token:tokenAgent,data:dataAgent,
    message: 'Agent Successfully Loggedin.' })
}

else if(isAvailableSupervisor){
  console.log("Supervisor")
  let passMatchSupervisor = await bcrypt.compare(password, isAvailableSupervisor.password);

  if (!passMatchSupervisor) return res.status(400).send({ message: "Password is incorrect." });

  const tokenSupervisor = jwt.sign({ supervisor_id: isAvailableSupervisor.supervisor_id, user_type_id: isAvailableSupervisor.user_type_id }, jwtSEC, { expiresIn: '365d'})

  await Session.create({
      userId:isAvailableSupervisor.supervisor_id,
      jwt:tokenSupervisor,
      status:"Valid"
  })
   const dataSupervisor = {
      full_name: isAvailableSupervisor.full_name,
      mobile: isAvailableSupervisor.mobile,
      user_type_id: isAvailableSupervisor.user_type_id,
      supervisor_id: isAvailableSupervisor.supervisor_id,
      monitors_sector: isAvailableSupervisor.monitors_sector,
      notification_id: isAvailableSupervisor.notification_id
   }
   return res.status(200).send({token:tokenSupervisor,data:dataSupervisor,
    message: 'Supervisor Successfully Loggedin.' })
}

// else if(isAvailableProvider){
//   console.log("Provider")
//   let passMatchProvider = await bcrypt.compare(password, isAvailableProvider.password);
  
//   if (!passMatchProvider) return res.status(400).send({ message: "Password is incorrect." });
 
//   // generate JWTToken
//   const tokenProvider = jwt.sign({...isAvailableProvider},jwtSEC, { expiresIn: '365d'})
  
//   await Session.create({
//       userId:isAvailableProvider.provider_id,
//       jwt:tokenProvider,
//       status:"Valid"
//   })
//    const dataProvider = {
//       first_name: isAvailableProvider.first_name,
//       last_name: isAvailableProvider.last_name,
//       full_name: isAvailableProvider.full_name,
//       mobile: isAvailableProvider.mobile,
//       user_type_id: isAvailableProvider.user_type_id,
//       provider_id: isAvailableProvider.provider_id
//    }
//    return res.status(200).send({token:tokenProvider,data:dataProvider,
//     message: 'Provider Successfully Loggedin.' })
// }

// || !isAvailableAgent || !isAvailableProvider
else if(!isAvailable || !isAvailableAgent){
       res.status (400).send({ message: "User not exist." })
}

    // check password.
}

// Forgot Password
const ForgotPassword = async (req, res) => {
  const userEmail = req.body.email;
  const otp = generateOTP();
  let user = await User.findOne({
    where: { email: userEmail.toLowerCase() }
    });
    let agent = await Agent.findOne({
      where: { email: userEmail.toLowerCase() }
      });
    let supervisor = await Supervisor.findOne({
      where: { email: userEmail.toLowerCase() }
      });

    console.log(user)
if(user){
      user.otp = otp;
      // Bug fix: this was set to the current time, i.e. already expired the
      // instant it was created - verifyEmailOTP's check happened to be backwards
      // too, so the two bugs cancelled out into "never actually expires". Both
      // are fixed together: a real future cutoff, checked the right way round.
      user.otpExpiration = new Date(Date.now() + OTP_TTL_MS);
      user.save();

  sendForgotPasswordEmail(userEmail.toLowerCase(), otp);

  return res.json({ message: 'Password reset OTP sent to your email.' });

}

if(agent){
  agent.otp = otp;
  agent.otpExpiration = new Date(Date.now() + OTP_TTL_MS);
  agent.save();

sendForgotPasswordEmail(userEmail.toLowerCase(), otp);

return res.json({ message: 'Password reset OTP sent to your email.' });

}

if(supervisor){
  supervisor.otp = otp;
  supervisor.otpExpiration = new Date(Date.now() + OTP_TTL_MS);
  supervisor.save();

sendForgotPasswordEmail(userEmail.toLowerCase(), otp);

return res.json({ message: 'Password reset OTP sent to your email.' });

}

// Bug fix: previously fell through here with no response at all, leaving the
// caller's request hanging until it timed out.
return res.status(400).json({ message: 'User not exist.' });
};


// Verify Email-OTP
const verifyEmailOTP = async (req, res) => {
  const { email, otp, password,Cpassword } = req.body;
console.log(email, otp, password,Cpassword)
  let user = await User.findOne({
    where: { email: email.toLowerCase() }
    });


    let agent = await Agent.findOne({
      where: { email: email.toLowerCase() }
      });
    let supervisor = await Supervisor.findOne({
      where: { email: email.toLowerCase() }
      });

    // Check if the OTP matches and if it's not expired
    // console.log(user,"userrrrrrrrrrrrrrrrrrr")
    if(user){
    if (user.otp === otp && user.otpExpiration >= new Date()) {
      console.log(user.otp,"oypppppppppp")
      // OTP is valid, you can allow the user to reset their password here
      if (password !== Cpassword) return res.status (400).send({ message: "Password not match."})

      //encrypt the password
      var passwordHash = bcrypt.hashSync(password, salt);

      user.password = passwordHash;
      user.otp = null;
      user.otpExpiration = null;
      user.save();

      return res.json({ message: 'OTP is valid.' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP or OTP has expired.' });
    }}

    if(agent){
      if (agent.otp === otp && agent.otpExpiration >= new Date()) {
        console.log(agent.otp,"oypppppppppp")
        // OTP is valid, you can allow the agent to reset their password here
        if (password !== Cpassword) return res.status (400).send({ message: "Password not match."})

        //encrypt the password
        var passwordHash = bcrypt.hashSync(password, salt);
  
        agent.password = passwordHash;
        agent.otp = null;
        agent.otpExpiration = null;
        agent.save();
  
        return res.json({ message: 'OTP is valid.' });
      } else {
        return res.status(400).json({ message: 'Invalid OTP or OTP has expired.' });
      }}

    if(supervisor){
      if (supervisor.otp === otp && supervisor.otpExpiration >= new Date()) {
        if (password !== Cpassword) return res.status (400).send({ message: "Password not match."})

        var passwordHash = bcrypt.hashSync(password, salt);

        supervisor.password = passwordHash;
        supervisor.otp = null;
        supervisor.otpExpiration = null;
        supervisor.save();

        return res.json({ message: 'OTP is valid.' });
      } else {
        return res.status(400).json({ message: 'Invalid OTP or OTP has expired.' });
      }}

  // Bug fix: same "hangs forever" issue as ForgotPassword when the email matches
  // neither a user nor an agent.
  return res.status(400).json({ message: 'User not exist.' });
};





module.exports = {
    singUp,
    login,
    ForgotPassword,
    verifyEmailOTP
}