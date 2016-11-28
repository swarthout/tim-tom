'use strict';

// tasks-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function (sequelize) {
  const tasks = sequelize.define('tasks', {
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    timer: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
      freezeTableName: true
    });

  tasks.sync();

  return tasks;
};
