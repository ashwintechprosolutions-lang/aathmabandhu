// Supervisor = a monitor who oversees a department's agents/complaints (or all
// departments, when monitors_sector is null). The one write action allowed is
// reassigning a complaint to a different officer (see
// supervisorController.reassignComplaint) - a Supervisor can never resolve a
// complaint or create/edit accounts, which is what still separates it from an
// Agent (who resolves complaints) and Admin (who manages everything).
module.exports = (sequelize, DataTypes) => {
    const Supervisor = sequelize.define("supervisor", {
        supervisor_id: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
        notification_id: { type: DataTypes.STRING },
        user_type_id: { type: DataTypes.INTEGER, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        full_name: { type: DataTypes.STRING, allowNull: false },
        mobile: { type: DataTypes.BIGINT(11), allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
        // Department this supervisor monitors - null/blank means all departments.
        monitors_sector: { type: DataTypes.STRING, allowNull: true },
        otp: { type: DataTypes.STRING },
        otpExpiration: { type: DataTypes.DATE },
        aadhar_number: { type: DataTypes.STRING, allowNull: false },
    })
    return Supervisor
}
