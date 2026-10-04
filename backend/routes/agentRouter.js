const agentController = require('../controllers/agentController')
const { checkLogin } = require('../middleWare/jwtMiddleWare')

const router = require('express').Router()

// Every route below requires a valid session.
router.use(checkLogin)

// auth routes
router.post('/createAgent', agentController.createAgent)
router.get('/getAllAgents', agentController.getAllAgents)
router.get('/getAgentDetails/:id', agentController.getAgentDetails)
router.get('/getAgentComplaints/:id', agentController.getAgentComplaints)
router.post('/changeStatus', agentController.changeStatus)
router.delete('/deleteAgent/:id', agentController.deleteAgent)
router.put('/updateAgentProfile', agentController.updateAgentProfile)



module.exports = router