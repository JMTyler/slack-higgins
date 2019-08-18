const _ = require('lodash');
const Slack = require('pico-slack');
const Epsilon = require('../epsilon.service');

const ROLES = ['captain', 'helm', 'weapons', 'engineering', 'science', 'relay', 'fighter'];

module.exports = {
	id     : ROLES.map((suffix) => `epsilon_approve_${suffix}`),
	handle : async (msg, info, reply, error) => {
		console.log('* INFO:', info);
		const user = info.user.name;
		await Epsilon.approveRole(user, info.actions[0].value);
		return reply({
			blocks : await Epsilon.buildUI(user),
		});
	},
};
