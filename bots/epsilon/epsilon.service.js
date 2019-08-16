const _ = require('lodash');

const Button = (text, value, style = 'danger') => {
	return {
		type: 'button',
		value,
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

const Dropdown = (action_id, options, selected = null) => {
	options = _.map(options, (text, value) => ({ value, text: { text, emoji: true, type: 'plain_text' } }));
	const initial_option = selected ? _.find(options, { value: selected }) : _.first(options);
	return {
		type: 'static_select',
		action_id,
		initial_option,
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

const ROLES = ['Captain', 'Helms', 'Weapons', 'Engineering', 'Science', 'Relay', 'Fighter Pilot'];
const State = {};

const ROLE_LABELS = {
	'Captain'       : ':captain-2: Captain',
	'Helms'         : ':helms: Helms',
	'Weapons'       : ':weapons: Weapons',
	'Engineering'   : ':engineering: Engineering',
	'Science'       : ':science: Science',
	'Relay'         : ':relay: Relay',
	'Fighter Pilot' : ':fighter: Fighter Pilot',
};

module.exports = {
	track(user, state) {
		State[user] = _.extend({}, State[user], state);
	},

	buildUI(user) {
		const state = State[user] || {};
		return [
			SectionBlock({
				text      : Markdown("_What's your #1 choice?_"),
				accessory : Dropdown('epsilon_topchoice', {
					'<any>'         : "Don't Care",
					'Captain'       : ':captain-2: Captain',
					'Helms'         : ':helms: Helms',
					'Weapons'       : ':weapons: Weapons',
					'Engineering'   : ':engineering: Engineering',
					'Science'       : ':science: Science',
					'Relay'         : ':relay: Relay',
					'Fighter Pilot' : ':fighter: Fighter Pilot',
				}, state.topChoice),
			}),

			Divider(),

			SectionBlock({
				text: Markdown("_Which roles are you *willing* to play, if you don't get your #1 choice?_"),
			}),
			ActionsBlock([
				Button(':captain-2: Captain', 'Captain'),
				Button(':helms: Helms', 'Helms'),
				Button(':weapons: Weapons', 'Weapons'),
				Button(':engineering: Engineering', 'Engineering'),
				Button(':science: Science', 'Science'),
				Button(':relay: Relay', 'Relay'),
				Button(':fighter: Fighter Pilot', 'Fighter Pilot'),
			]),

			Divider(),

			SectionBlock({
				text      : Markdown(`You have chosen to play as:\n*:captain-2: Captain*, *:weapons: Weapons*, *:relay: Relay*, or *:fighter: Fighter Pilot*\n(but ideally *${state.topChoice ? ROLE_LABELS[state.topChoice] : 'srsly fucking choose something'}*)`),
				accessory : Image('https://daid.github.io/EmptyEpsilon/images/logo.png', 'empty epsilon logo'),
			}),

			Divider(),

			ActionsBlock(Button('epsilon_commit', 'ＲＥＡＤＹ  ＵＰ', 'ok', 'primary')),
			ContextBlock(Markdown('_Remember, you can always type `/epsilon` and edit your choices later!_')),
		];
	},
};
