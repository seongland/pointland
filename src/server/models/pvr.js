/* jshint indent: 1 */

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'pvr',
    {
      pvrid: {
        type: DataTypes.INTEGER(10).UNSIGNED,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      north: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      seq: {
        type: DataTypes.INTEGER(5),
        allowNull: false
      },
      sourcepath: {
        type: DataTypes.STRING(400),
        allowNull: false
      },
      latitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      },
      longitude: {
        type: DataTypes.DOUBLE,
        allowNull: false
      }
    },
    {
      tableName: 'pvr'
    }
  )
}
