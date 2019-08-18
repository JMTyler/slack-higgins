const _ = require('lodash');
const Slack = require('pico-slack');
const EpsilonService = require('./epsilon.service');

module.exports = {
	id     : ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((suffix) => `epsilon_approve_${suffix}`),
	handle : async (msg, info, reply, error) => {
		console.log('* INFO:', info);
		const user = info.user.name;
		await EpsilonService.toggleChoice(user, info.actions[0].value);
		return reply({
			blocks : await EpsilonService.buildUI(user),
		});
	},
};
