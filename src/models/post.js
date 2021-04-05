'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, {
        onDelete: 'CASCADE',
        foreignKey: {
          fieldName: 'author',
          allowNull: false,
          require: true
        },
        targetKey: 'id'
      });
    }
  };
  Post.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    author: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};