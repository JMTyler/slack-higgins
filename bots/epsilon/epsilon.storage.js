const _ = require('lodash');
const DB = require('../../db.js');

module.exports = {
	getPlayer : _.memoize(async (username) => {
		await initialize();
		return await Player.load(username);
	}),
};

class Player extends DB.Sequelize.Model {
	static async load(username) {
		let player = await Player.findOne({
			where   : { username },
			include : [Choice],
		});
		
		if (!player) {
			player = Player.build({ username });
			player.choices = [];
		}
		
		player.choices = _.map(player.choices, 'role');
		
		return player;
	}
	
	async addChoice(role) {
		if (!role || this.choices.includes(role)) {
			return;
		}
		
		this.choices.push(role);
		return Choice.create({ role, username: this.username });
	}
	
	async removeChoice(role) {
		if (!this.choices.includes(role)) {
			return;
		}
		
		_.pull(this.choices, role);
		return Choice.destroy({ where: { role, username: this.username } });
	}
}

Player.init({
	username : {
		type      : DB.Sequelize.TEXT,
		allowNull : false,
		unique    : true,
	},
	ready : {
		type         : DB.Sequelize.BOOLEAN,
		allowNull    : false,
		defaultValue : false,
	},
	preferredRole : {
		type : DB.Sequelize.TEXT,
	},
	numComputers : {
		type         : DB.Sequelize.INTEGER,
		allowNull    : false,
		defaultValue : 0,
	},
}, {
	sequelize : DB.sequelize,
	schema    : 'Epsilon',
	tableName : 'Players',
});

class Choice extends DB.Sequelize.Model {}

Choice.init({
	username : {
		type      : DB.Sequelize.TEXT,
		allowNull : false,
	},
	role : {
		type      : DB.Sequelize.TEXT,
		allowNull : false,
	},
}, {
	sequelize : DB.sequelize,
	schema    : 'Epsilon',
	tableName : 'Choices',
	modelName : 'choice',
});

Choice.belongsTo(Player, { targetKey: 'username', sourceKey: 'username', foreignKey: 'username' });
Player.hasMany(Choice, { sourceKey: 'username', targetKey: 'username', foreignKey: 'username' });

let initialized = false;
const initialize = async () => {
	if (initialized) return;
	await DB.sequelize.createSchema('"Epsilon"');
	await Player.sync();
	await Choice.sync();
	initialized = true;
};
