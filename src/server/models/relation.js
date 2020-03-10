/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('relation', {
		from: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'pvr',
				key: 'pvrid'
			}
		},
		to: {
			type: DataTypes.INTEGER(10).UNSIGNED,
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'pvr',
				key: 'pvrid'
			}
		},
		pan: {
			type: DataTypes.FLOAT,
			allowNull: false
		}
	}, {
		tableName: 'relation'
	});
};
