const notificationController = require('../controllers/notificationController')
const { checkLogin } = require('../middleWare/jwtMiddleWare')

const router = require('express').Router()

// Every route below requires a valid session.
router.use(checkLogin)

// Notification Routes
router.post('/sendNotifications', notificationController.sendNotifications)
router.get('/getNotifications/:id', notificationController.getNotifications)
router.delete('/deleteNotification/:id', notificationController.deleteNotification)

module.exports = router