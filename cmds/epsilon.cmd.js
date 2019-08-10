
const _ = require('lodash');

module.exports = {
	url    : '/epsilon',
	handle : (msg, info, reply, error) => {
		// check if it's jared
		// if yes, check msg for context
		// otherwise:

		console.log(info);

		return reply({
			"channel": "general",
			"text": "fallback text for notifications",
			"blocks": [
				{
					"type": "section",
					"text": {"type": "mrkdwn", "text": "_Pick your #1 choice, if you have one:_"},
					"accessory": {
						"type": "static_select",
						"action_id": "bleep",
						"initial_option": {"value": "<any>", "text":{"type":"plain_text", "text": "Don't Care" } },
						"options": [
							{"value": "<any>", "text":{"type":"plain_text", "text": "Don't Care"} },
							{"value": "Captain", "text":{"type":"plain_text", "emoji": true, "text": ":captain-2: Captain"} },
							{"value": "Helms", "text":{"type":"plain_text", "emoji": true, "text": ":helms: Helms"} },
							{"value": "Weapons", "text":{"type":"plain_text", "emoji": true, "text": ":weapons: Weapons"} },
							{"value": "Engineering", "text":{"type":"plain_text", "emoji": true, "text": ":engineering: Engineering"} },
							{"value": "Science", "text":{"type":"plain_text", "emoji": true, "text": ":science: Science"} },
							{"value": "Relay", "text":{"type":"plain_text", "emoji": true, "text": ":relay: Relay"} },
							{"value": "Fighter Pilot", "text":{"type":"plain_text", "emoji": true, "text": ":fighter: Fighter Pilot"} }
						]
					}
				},
				{
					"type": "divider"
				},
				{
					"type": "section",
					"text": {"type": "mrkdwn", "text": "_Then select which roles you are *willing* to play if you don't get your #1 choice:_"}
				},
				{
					"type": "actions",
					"elements": [
						{
							"type": "button",
							"text": {"type": "plain_text", "emoji": true, "text": ":captain-2: Captain"}
						},
						{
							"type": "button",
							"text": {"type": "plain_text", "emoji": true, "text": ":helms: Helms"}
						},
						{
							"type": "button",
							"text": {"type": "plain_text", "emoji": true, "text": ":weapons: Weapons"}
						},
						{
							"type": "button",
							"text": {"type": "plain_text", "emoji": true, "text": ":engineering: Engineering"}
						},
						{
							"type": "button",
							"text": {"type": "plain_text", "emoji": true, "text": ":science: Science"}
						},
						{
							"type": "button",
							"text": {"type": "plain_text", "emoji": true, "text": ":relay: Relay"}
						},
						{
							"type": "button",
							"text": {"type": "plain_text", "emoji": true, "text": ":fighter: Fighter Pilot"}
						}
					]
				},
				{
					"type": "divider"
				},
				{
					"type": "section",
					"text": {"type": "mrkdwn", "text": "You have chosen to play as:\n*:captain-2: Captain*, *:weapons: Weapons*, *:relay: Relay*, or *:fighter: Fighter Pilot*\n(but ideally *:weapons: Weapons*)"},
					"accessory": {
						"type": "image",
						"alt_text": "empty epsilon logo",
						"image_url": "https://daid.github.io/EmptyEpsilon/images/logo.png"
					}
				},
				{
					"type": "divider"
				},
				{
					"type": "actions",
					"elements": [{
						"type": "button",
						"text": {"type": "plain_text", "text": "ＲＥＡＤＹ  ＵＰ"},
						"style": "primary"
					}]
				},
				{
					"type": "context",
					"elements": [{
						"type": "mrkdwn",
						"text": "_Remember, you can always type `/epsilon` and edit your choices later!_"
					}]
				}
			]
		});
	},
};
