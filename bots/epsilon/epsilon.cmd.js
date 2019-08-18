
const _ = require('lodash');
const Slack = require('pico-slack');
const Epsilon = require('./epsilon.service');

module.exports = {
	url    : '/epsilon',
	handle : async (msg, info, reply, error) => {
		// check if it's jared
		// if yes, check msg for context
		// otherwise:

		console.log(info);
		
		// TODO: Should we do this?
		Epsilon.NOWAIT(info.user_name);

//		console.log('**message response', JSON.stringify(blocks, null, 2));
		return reply({
//		Slack.api('chat.postMessage', {
			channel    : info.channel_id,
			username   : "Ship's Computer",
			icon_emoji : ':rocket:',
			text       : 'fallback text for notifications',
			blocks     : await Epsilon.buildUI(info.user_name),
		});
//		return res.status(200).send({ delete_original: true });
		return reply();
	},
};
