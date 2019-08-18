const _ = require('lodash');
const Slack = require('pico-slack');
const EpsilonService = require('./epsilon.service');

module.exports = {
	id     : 'epsilon_topchoice',
	handle : async (msg, info, reply, error) => {
		console.log('* INFO:', info);
		
		const user = info.user.name;
		await EpsilonService.selectPreferredRole(user, info.actions[0].selected_option.value);
		return reply({
			blocks : await EpsilonService.buildUI(user),
		});
	}
};
