module.exports = (sequelize, DataTypes) =>{
    const Complaint =  sequelize.define("complaint", {
        complaint_id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false},
        sector: {type: DataTypes.STRING, allowNull: false },
        notes:{type: DataTypes.STRING},
        agent_id:{type: DataTypes.INTEGER},
        status:{type: DataTypes.STRING},
        // Low | Medium | High - set by services/caseLevelClassifier.js at
        // registration time and used to pick which officer level it's routed to.
        case_level:{type: DataTypes.STRING},
        complaint_address:{type: DataTypes.STRING},
        complaint_pincode:{type: DataTypes.INTEGER},
        pdfComplaint:{
            type: DataTypes.STRING
        },
    })

    return Complaint
}
