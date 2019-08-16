const _ = require('lodash');
const Slack = require('pico-slack');
const EpsilonService = require('./epsilon.service');

module.exports = {
	id     : 'epsilon_topchoice',
	handle : async (msg, info, reply, error) => {
		console.log('* INFO:', info);
		
		const user = info.user.name;
		EpsilonService.track(user, { topChoice: info.actions[0].selected_option.value });
		return reply({
			blocks : EpsilonService.buildUI(user),
		});
	}
};
