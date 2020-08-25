const Sequelize = require('sequelize');
const sequelize = require('../sequelize');
const { v4: uuidv4 } = require('uuid');

const Media = sequelize.define( 'medias', {
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
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);

Media.beforeCreate((media, _ ) => {
  return media.id = uuidv4();
});

module.exports = Media;