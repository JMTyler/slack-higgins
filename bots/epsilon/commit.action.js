const _ = require('lodash');
const Slack = require('pico-slack');
const EpsilonService = require('./epsilon.service');

module.exports = {
	id     : 'epsilon_commit',
	handle : async (msg, info, reply, error) => {
		console.log('* INFO:', info);
		const user = info.user.name;
		await EpsilonService.READYUP(user);
		return reply({
			blocks : await EpsilonService.buildUI(user),
		});
	},
};
