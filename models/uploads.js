var sequelize = require('../config/database')

var Uploads = sequelize.define('Uploads', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  pictures: {
    type: Sequelize.STRING,
    allowNull: false
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
},
{
  classMethods: {
    associate: function (models) {
      models.Uploads.belongsTo(models.Category, { constraints: false })
    }
  }
})

Uploads.associate = function (models) {
  Uploads.hasOne(models.Votes,
    {
      foreignKey: 'upload_id',
      constraints: false
    }
  )
}

module.exports = Uploads
