const dbConfig = require('../config/dbConfig.js');

const {Sequelize, DataTypes} = require('sequelize');

const sequelize =  new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)


sequelize.authenticate()
.then(()=>{
    console.log("Connected")
})
.catch(err => {
    console.log(err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./userModel.js')(sequelize, DataTypes)
db.sessions = require('./sessionModel.js')(sequelize, DataTypes)
db.notifications = require('./notificationModel.js')(sequelize, DataTypes)
db.complaints = require('./complaintsModel.js')(sequelize, DataTypes)
db.agents = require('./agentsModel.js')(sequelize, DataTypes)
db.supervisors = require('./supervisorsModel.js')(sequelize, DataTypes)


db.sequelize.sync({ force: false })
.then(()=>{
    console.log("Sync is done")
})

module.exports = db