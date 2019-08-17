const _ = require('lodash');
const DB = require('../db.js');
const Slack = require('pico-slack');

class Message extends DB.Sequelize.Model {}
Message.init({
	author : {
		type      : DB.Sequelize.TEXT,
		allowNull : false,
	},
	channel : {
		type      : DB.Sequelize.TEXT,
		allowNull : false,
	},
	messageTimestamp : {
		type      : DB.Sequelize.TEXT,
		allowNull : false,
	},
	body : {
		type      : DB.Sequelize.TEXT,
		allowNull : false,
	},
	flaggedBy : {
		type      : DB.Sequelize.TEXT,
		allowNull : false,
	},
}, {
	sequelize : DB.sequelize,
	schema    : 'public',
	tableName : 'Messages',
});

let initialized = false;
const initialize = async () => {
	if (initialized) return;
	await Message.sync();
	initialized = true;
};

module.exports = {
	id     : 'secret',
	handle : async (msg, info, reply, error) => {
		const flaggedBy = info.user.name;
		if (!_.includes([ 'jared', 'jenny' ], flaggedBy)) return error(`lol, you think you're allowed to do that? :troll:`);

		const channel = info.channel.name;
		const messageTimestamp = info.message.ts;

		try {
			await initialize();
			const flagged = await Message.findOne({ where: { channel, messageTimestamp } });
			if (flagged) {
				return error(`That message was already flagged by ${flagged.flaggedBy}! :joy_b:`);
			}

			await Message.create({
				channel,
				messageTimestamp,
				flaggedBy,

				author : Slack.users[info.message.user],
				body   : msg,
			});

			const count = await Message.count();

			return reply({ attachments: [{ pretext: `Message successfully flagged. :thumbsup:`, footer: `Total number of flagged messages: ${count}` }] });
		} catch (err) {
			console.error('[SecretAction]', err.message, err);
			return error(`*i got all jacked up:* ${err.message}`);
		}
	}
};
