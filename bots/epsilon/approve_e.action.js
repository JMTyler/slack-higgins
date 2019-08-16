const _ = require('lodash');
const Slack = require('pico-slack');
const EpsilonService = require('./epsilon.service');

module.exports = {
	id     : 'epsilon_approve_e',
	handle : async (msg, info, reply, error) => {
		console.log('* INFO:', info);
		const user = info.user.name;
		EpsilonService.approveRole(user, info.actions[0].value);
		return reply({
			blocks : EpsilonService.buildUI(user),
		});
	},
};
