const _ = require('lodash');
const Slack = require('pico-slack');
const EpsilonService = require('./epsilon.service');

module.exports = {
	id     : 'epsilon_puters',
	handle : async (msg, info, reply, error) => {
		console.log('* INFO:', info);
		
		const user = info.user.name;
		const puters = info.actions[0].selected_option.value;
		await EpsilonService.howManyPutersYall(user, puters);
		return reply({
			blocks : await EpsilonService.buildUI(user),
		});
	}
};
