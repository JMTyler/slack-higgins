const _ = require('lodash');
const glob = require('glob');
const path = require('path');
const request = require('request');
const Slack = require('pico-slack');

const router = require('express').Router();
router.use(require('body-parser').urlencoded({ extended: false }))

const formatResponse = (response)=>{
	if(_.isString(response)){
		return {text: response};
	} else if(!_.isPlainObject(response)){
		return {text: JSON.stringify(response)};
	} else {
		return response;
	}
};

const sendResponse = (actionInfo, response) => {
	return request.post(actionInfo.response_url, {
		json : true,
		body : _.assign({
			'response_type' : 'ephemeral',
		}, formatResponse(response))
	});
};

module.exports = (actionFolders)=>{
	return new Promise((resolve, reject)=>{
		if(!_.isArray(actionFolders)) actionFolders = [actionFolders];
		actionFolders = actionFolders.map((folder)=>`${folder}/**/*.action.js`);
		const globPattern = actionFolders.length == 1 ? _.first(actionFolders) : '{' + actionFolders.join(',') + '}';
		glob(globPattern, {}, (err, files)=>{
			if(err) return reject(err);
			return resolve(files);
		});
	})
		.then((actionpaths)=>{
			return _.reduce(actionpaths, (r, actionpath)=>{
				try {
					r.push(require(actionpath));
					console.log('loaded', actionpath);
				} catch (e){
					Slack.error('Action Load Error', e);
				}
				return r;
			}, []);
		})
		.then((actions)=>{
			const Actions = _.mapKeys(actions, 'id');
			router.post('/action', (req, res)=>{
				const input = JSON.parse(req.body.payload);
				console.log('* ACTION:', input);
				const pathToActionId = ({
					message_action : 'callback_id',
					block_actions  : 'actions[0].action_id',
				})[input.type];

				const actionId = _.get(input, pathToActionId);
				if (!actionId || !Actions[actionId]) return res.status(422).send();
				res.status(200).send();

				try {
					Actions[actionId].handle(
						input.message.text,
						input,
						(response) => {
							return sendResponse(input, response);
						},
						(error) => {
							return sendResponse(input, error);
						}
					);
				} catch (err){
					Slack.error('Action Run Error', err);
				}
			});
			return router;
		});

};