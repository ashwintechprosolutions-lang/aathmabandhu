const supervisorController = require('../controllers/supervisorController')
const { checkLogin } = require('../middleWare/jwtMiddleWare')

const router = require('express').Router()

router.use(checkLogin)

router.post('/createSupervisor', supervisorController.createSupervisor)
router.get('/getAllSupervisors', supervisorController.getAllSupervisors)
router.get('/getSupervisorDetails/:id', supervisorController.getSupervisorDetails)
router.delete('/deleteSupervisor/:id', supervisorController.deleteSupervisor)
router.put('/updateSupervisorProfile', supervisorController.updateSupervisorProfile)

module.exports = router
