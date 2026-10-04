module.exports = (sequelize, DataTypes) =>{
    const Notification =  sequelize.define("notification", {
        notification_id: { type: DataTypes.STRING, allowNull: false},
        message: {type: DataTypes.STRING, allowNull: false},
        date: {type: DataTypes.STRING, allowNull: false},
        time: {type: DataTypes.STRING, allowNull: false},
        meet: {type: DataTypes.STRING}
    })

    return Notification
}