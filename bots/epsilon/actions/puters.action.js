const _ = require('lodash');
const Slack = require('pico-slack');
const Epsilon = require('../epsilon.service');

module.exports = {
	id     : 'epsilon_puters',
	handle : async (msg, info, reply, error) => {
		console.log('* INFO:', info);
		
		const user = info.user.name;
		const puters = info.actions[0].selected_option.value;
		await Epsilon.howManyPutersYall(user, puters);
		return reply({
			blocks : await Epsilon.buildUI(user),
		});
	}
};
