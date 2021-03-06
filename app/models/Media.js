const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

const Media = sequelize.define('media', 
  {
    id: {
      type: Sequelize.STRING,
      field: 'id',
      primaryKey: true
    },
    filename: {
      type: Sequelize.STRING,
      field: 'filename'
    },
    location: {
      type: Sequelize.STRING,
      field: 'location'
    },
    type: {
      type: Sequelize.STRING,
      field: 'type'
    }
  }, 
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    freezeTableName: true
  }
);

Media.beforeCreate((media, _ ) => {
  return media.id = uuidv4();
});

module.exports = Media;