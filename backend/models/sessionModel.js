module.exports = (sequelize, DataTypes) =>{
    const Session =  sequelize.define("session", {
        session_id: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
        userId: {type: DataTypes.STRING, allowNull: false },
        jwt: { type: DataTypes.TEXT, allowNull: false },
        status: {type: DataTypes.STRING, allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    })

    return Session
}