
const _ = require('lodash');
const Slack = require('pico-slack');

const Button = (text, style = 'danger') => {
	return {
		type: 'button',
		text: { text, emoji: true, type: 'plain_text' },
		style,
	};
};

const Image = (image_url, alt_text = '') => {
	return { image_url, alt_text, type: 'image' };
};

const Markdown = (text) => {
	return { text, type: 'mrkdwn' };
};

const Dropdown = (action_id, options) => {
	options = _.map(options, (text, value) => ({ value, text: { text, emoji: true, type: 'plain_text' } }));
	return {
		type: 'static_select',
		action_id,
		initial_option: _.first(options),
		options,
	};
};

const SectionBlock = (options) => {
	return _.extend({ type: 'section' }, options);
};

const ActionsBlock = (elements) => {
	if (!_.isArray(elements)) elements = [elements];
	return { type: 'actions', elements };
};

const ContextBlock = (elements) => {
	if (!_.isArray(elements)) elements = [elements];
	return { type: 'context', elements };
};

const Divider = () => {
	return { type: 'divider' };
};

module.exports = {
	url    : '/epsilon',
	handle : (msg, info, reply, error) => {
		// check if it's jared
		// if yes, check msg for context
		// otherwise:

		console.log(info);

		const blocks = [
			SectionBlock({
				text      : Markdown("_What's your #1 choice?_"),
				accessory : Dropdown('bleep', {
					'<any>'         : "Don't Care",
					'Captain'       : ':captain-2: Captain',
					'Helms'         : ':helms: Helms',
					'Weapons'       : ':weapons: Weapons',
					'Engineering'   : ':engineering: Engineering',
					'Science'       : ':science: Science',
					'Relay'         : ':relay: Relay',
					'Fighter Pilot' : ':fighter: Fighter Pilot',
				}),
			}),

			Divider(),

			SectionBlock({
				text: Markdown("_Which roles are you *willing* to play, if you don't get your #1 choice?_"),
			}),
			ActionsBlock([
				Button(':captain-2: Captain'),
				Button(':helms: Helms'),
				Button(':weapons: Weapons'),
				Button(':engineering: Engineering'),
				Button(':science: Science'),
				Button(':relay: Relay'),
				Button(':fighter: Fighter Pilot'),
			]),

			Divider(),

			SectionBlock({
				text      : Markdown('You have chosen to play as:\n*:captain-2: Captain*, *:weapons: Weapons*, *:relay: Relay*, or *:fighter: Fighter Pilot*\n(but ideally *:weapons: Weapons*)'),
				accessory : Image('https://daid.github.io/EmptyEpsilon/images/logo.png', 'empty epsilon logo'),
			}),

			Divider(),

			ActionsBlock(Button('ＲＥＡＤＹ  ＵＰ', 'primary')),
			ContextBlock(Markdown('_Remember, you can always type `/epsilon` and edit your choices later!_')),
		];
		console.log('**message response', JSON.stringify(blocks, null, 2));
		return reply({
//		Slack.api('chat.postMessage', {
			channel    : info.channel_id,
			username   : "Ship's Computer",
			icon_emoji : ':rocket:',
			text       : 'fallback text for notifications',
			blocks,
		});
//		return res.status(200).send({ delete_original: true });
		return reply();
	},
};
