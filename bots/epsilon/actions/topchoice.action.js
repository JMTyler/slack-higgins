const _ = require('lodash');
const Slack = require('pico-slack');
const Epsilon = require('../epsilon.service');

module.exports = {
	id     : 'epsilon_topchoice',
	handle : async (msg, info, reply, error) => {
		console.log('* INFO:', info);
		
		const user = info.user.name;
		let role = info.actions[0].selected_option.value;
		if (role == '<any>') {
			role = null;
		}
		
		await Epsilon.selectPreferredRole(user, role);
		return reply({
			blocks : await Epsilon.buildUI(user),
		});
	}
};
