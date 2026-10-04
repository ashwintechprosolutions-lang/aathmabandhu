const db = require('../models')

const Notification = db.notifications;

const sendNotifications = async (req,res)=>{
    let { notification_id, message, date, time } = req.body;

     await Notification.create({
        notification_id: notification_id,
        message: message,
        date: date,
        time: time
});

return res.status(200).json({ message: "Notification Sent Succesfully." });

}


const getNotifications = async (req,res)=>{
    let id = req.params.id

   let notifications = await Notification.findAll({
        where: { notification_id: id }
        });
console.log(notifications,"oooopppppppp")
return res.status(200).json({ data:notifications });

}


const deleteNotification = async (req,res)=>{

    let id =  req.params.id
    try {
        await Notification.destroy({ where: { id: id }});
        res.status(200).send("Notification Deleted");
      } catch (error) {
        console.error("Error deleting notification:", error);
        res.status(500).send("Internal Server Error");
      }
}

module.exports = {
    sendNotifications,
    getNotifications,
    deleteNotification
}