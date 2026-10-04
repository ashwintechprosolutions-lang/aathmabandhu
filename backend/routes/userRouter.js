const userController = require('../controllers/userController')
const { checkLogin } = require('../middleWare/jwtMiddleWare')

const router = require('express').Router()

// Every route below requires a valid session (auth/signUp and auth/login are the
// only public routes - see server.js).
router.use(checkLogin)

router.get('/getAllComplaints/:id', userController.getAllComplaints)
router.get('/getComplaintDetails/:id', userController.getComplaintDetails)
router.get('/getAllUsers', userController.getAllUsers)
router.get('/getUserDetails/:id', userController.getUserDetails)
router.put('/updateUserProfile', userController.updateUserProfile)

module.exports = router