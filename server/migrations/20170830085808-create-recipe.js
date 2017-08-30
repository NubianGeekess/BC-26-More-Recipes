module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Recipes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      ingredients: {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      direction: {
        type: Sequelize.STRING
      },
      vpvotes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      downvotes: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'User',
          key: 'id',
          as: 'userId',
        }
      }
    });
  },
  down(queryInterface, /* Sequelize */) {
    return queryInterface.dropTable('Recipes');
  }
};