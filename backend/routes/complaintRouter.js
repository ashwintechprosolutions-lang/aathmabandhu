const complaintsController = require('../controllers/complaintsController')
const { checkLogin } = require('../middleWare/jwtMiddleWare')

const router = require('express').Router()

// Every route below requires a valid session.
router.use(checkLogin)

// complaints routes
router.post('/registerComplaint', complaintsController.upload,complaintsController.registerComplaint)
router.get('/getAllComplaints', complaintsController.getAllComplaints)


module.exports = router