const _ = require('lodash');
const glob = require('glob');
const path = require('path');
const Slack = require('pico-slack');

const router = require('express').Router();
router.use(require('body-parser').urlencoded());

const formatResponse = (response)=>{
	if(_.isString(response)){
		return {text: response};
	} else if(!_.isPlainObject(response)){
		return {text: JSON.stringify(response)};
	} else {
		return response;
	}
};

module.exports = (cmdFolders)=>{
	return new Promise((resolve, reject)=>{
		if(!_.isArray(cmdFolders)) cmdFolders = [cmdFolders];
		cmdFolders = cmdFolders.map((folder)=>`${folder}/**/*.cmd.js`);
		const globPattern = cmdFolders.length == 1 ? _.first(cmdFolders) : '{' + cmdFolders.join(',') + '}';
		glob(globPattern, {}, (err, files)=>{
			if(err) return reject(err);
			return resolve(files);
		});
	})
		.then((cmdpaths)=>{
			return _.reduce(cmdpaths, (r, cmdpath)=>{
				try {
					r.push(require(cmdpath));
					console.log('loaded', cmdpath);
				} catch (e){
					Slack.error('Cmd Load Error', e);
				}
				return r;
			}, []);
		})
		.then((cmds)=>{
			_.each(cmds, (cmd)=>{
				router.all(cmd.url, (req, res)=>{
					const input = _.assign({}, req.query, req.body);
					try {
						cmd.handle(
							input.text,
							input,
							(response)=>{
								return res.status(200).send(_.assign({
									'response_type' : 'in_channel',
								}, formatResponse(response)));
							},
							(error)=>{
								return res.status(200).send(_.assign({
									'response_type' : 'ephemeral',
								}, formatResponse(error)));
							}
						);
					} catch (err){
						Slack.error('Command Run Error', err);
						return res.status(200).send();
					}
				});
			});
			return router;
		});

};