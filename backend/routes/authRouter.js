const authController = require('../controllers/authController')

const router = require('express').Router()

// auth routes
router.post('/signUp', authController.singUp)
router.post('/login', authController.login)
router.post('/ForgotPassword', authController.ForgotPassword)
router.post('/verifyEmailOTP', authController.verifyEmailOTP)


module.exports = router