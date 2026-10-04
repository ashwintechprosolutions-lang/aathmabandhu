module.exports = (sequelize, DataTypes) =>{
    const User =  sequelize.define("user", {
        user_id: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
        user_type_id: { type: DataTypes.INTEGER, allowNull: false},
        notification_id: { type: DataTypes.STRING},
        email: {type: DataTypes.STRING, allowNull: false,unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        full_name: {type: DataTypes.STRING, allowNull: false },
        aadhar_number: { type: DataTypes.STRING, allowNull: false },
        mobile: { type: DataTypes.BIGINT(11), allowNull: false },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        userImage:{
            type: DataTypes.STRING
        },
        otp: { type: DataTypes.STRING},
        otpExpiration: {type: DataTypes.DATE},
        
    })

    return User
}

// full_name: {
//   type: DataTypes.VIRTUAL,
//   get() {
//     return `${this.first_name} ${this.last_name}`;
//   },
//   set(value) {
//     throw new Error('Do not try to set the `full_name` value!');
//   }
// }