const _ = require('lodash');
const EpsilonDB = require('./epsilon.storage.js');

const Button = (action_id, text, value, style = undefined) => {
	return {
		type: 'button',
		action_id,
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

const ROLES = {
	'captain'     : ':captain-2: Captain',
	'helm'        : ':helms: Helm',
	'weapons'     : ':weapons: Weapons',
	'engineering' : ':engineering: Engineering',
	'science'     : ':science: Science',
	'relay'       : ':relay: Relay',
	'fighter'     : ':fighter: Fighter Pilot',
};

module.exports = {
	async selectPreferredRole(user, role) {
		const player = await EpsilonDB.getPlayer(user);
		player.preferredRole = role;
		player.addChoice(role);
		player.save();
	},
	
	async approveRole(user, role) {
		const player = await EpsilonDB.getPlayer(user);
		player.addChoice(role);
	},
	
	async rejectRole(user, role) {
		const player = await EpsilonDB.getPlayer(user);
		player.removeChoice(role);
		
		if (player.preferredRole == role) {
			player.preferredRole = null;
			player.save();
		}
	},
	
	async howManyPutersYall(user, puters) {
		const player = await EpsilonDB.getPlayer(user);
		player.numComputers = puters;
		player.save();
	},

	async buildUI(user) {
		const player = await EpsilonDB.getPlayer(user);
		// *:captain-2: Captain*, *:weapons: Weapons*, *:relay: Relay*, or *:fighter: Fighter Pilot*
		const chosenRoles = !_.isEmpty(player.choices) ? '*' + _.map(player.choices, (r) => ROLES[r]).join('*, *') + '*' : 'nothing yet';
		return [
			SectionBlock({
				text      : Markdown(`---\n\n*EmptyEpsilon Preferences for _${user}_*\n\n---`),
				accessory : Image('https://daid.github.io/EmptyEpsilon/images/logo.png', 'empty epsilon logo'),
			}),
			
			Divider(),
			
			SectionBlock({
				text      : Markdown("_1. What's your #1 choice?_"),
				accessory : Dropdown('epsilon_topchoice', {
					'<any>'       : "Don't Care",
					'captain'     : ':captain-2: Captain',
					'helm'        : ':helms: Helm',
					'weapons'     : ':weapons: Weapons',
					'engineering' : ':engineering: Engineering',
					'science'     : ':science: Science',
					'relay'       : ':relay: Relay',
					'fighter'     : ':fighter: Fighter Pilot',
				}, player.preferredRole),
			}),

			Divider(),

			SectionBlock({
				text: Markdown("_2. And if you *don't* get your #1 choice?_"),
			}),
			ActionsBlock(_.chain(ROLES).pickBy((label, role) => !player.choices.includes(role)).map((label, role) => Button(`epsilon_approve_${role}`, label, role)).value()),

			Divider(),
			
			SectionBlock({
				text: Markdown(`_*Great!* In summary, you'd ideally like to play as *${player.preferredRole ? ROLES[player.preferredRole] : 'srsly fucking choose something'}*, but you're also willing to play any of the following (click to remove):_`),
			}),
			ActionsBlock(_.chain(ROLES).pickBy((label, role) => player.choices.includes(role)).map((label, role) => Button(`epsilon_reject_${role}`, label, role)).value()),
			
			Divider(),
			
			SectionBlock({
				text      : Markdown("_3. How many computers can you bring?_"),
				accessory : Dropdown('epsilon_puters', { '0': '0', '1': '1', '2': '2', '3': '3', '4': '4+' }, player.numComputers),
			}),

			Divider(),

			ActionsBlock(Button('epsilon_commit', 'ＲＥＡＤＹ  ＵＰ', 'ok', 'primary')),
			ContextBlock(Markdown('_Remember, you can always type `/epsilon` and edit your choices later!_')),
		];
	},
};
