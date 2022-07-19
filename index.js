const Mirai = require('node-mirai-sdk');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.json');

const bot = new Mirai(config.mirai);
const server = express();
const {Plain, Image} = Mirai.MessageComponent;
const getTime = () => new Date().toLocaleString();
const ckeckToken = (token = '') =>
	config.webhook.token.length && config.webhook.token !== token;
const responseText = [
	'success', // 成功
	'token invalid', // token 失效
	'unsupported method', // 不支持的请求方式
	'server error', // 服务器错误
];

bot.onSignal('authed', () => {
	console.log(`${getTime()} 通过：${bot.sessionKey} 认证中···`);
	bot.verify();
});

bot.onSignal('verified', () => {
	sendRawMessage('Webhook 已启用', null);
	console.log(`${getTime()} 通过：${bot.sessionKey} 认证成功！\n`);
});

/**
 * 发送 QQ 消息
 * @param {string} text 文本消息
 * @param {string} image 图片消息（图片 URL）
 */
function sendRawMessage(text, image) {
	let messageChain = [];
	if (text && text.length) {
		messageChain.push(Plain(text));
	}
	if (image && image.length) {
		messageChain.push(Image({url: image}));
	}
	if (config.bot.isGroup) {
		bot.sendGroupMessage(messageChain, config.bot.target);
	} else {
		bot.sendFriendMessage(messageChain, config.bot.target);
	}
}

/**
 * 根据错误码获取响应内容
 * @param {number} err 错误状态（0-成功; 1-token 失效; 2-不支持的请求方式; 3-服务器错误）
 * @returns {string} 响应内容
 */
function getResponse(err) {
	return `{err: ${err}, msg: "${responseText[err]}"}`;
}

server
	.use(bodyParser.text({type: 'text/plain'}))
	.use(bodyParser.json({type: 'application/json'}))
	.use((err, _req, res, next) => {
		res.type('json').end(getResponse(3));
		next(err);
	})
	.get('/', (req, res) => {
		const {token, text, image} = req.query;
		if (ckeckToken(token)) {
			res.type('json').end(getResponse(1));
			return;
		}
		sendRawMessage(text, image);
		res.type('json').end(getResponse(0));
		console.log(`${getTime()} webhook 调用成功`);
	})
	.post('/', (req, res) => {
		const type = req.get('Content-Type');
		let token = req.query.token || '';
		let image = '';
		let text = '';
		switch (type) {
			case 'text/plain':
				token = req.query.token;
				text = req.body;
				break;
			case 'application/json':
				token = token || req.body.token;
				text = req.body.text;
				image = req.body.image;
				break;
			default:
				res.type('json').end(getResponse(2));
				return;
		}
		if (ckeckToken(token)) {
			res.type('json').end(getResponse(1));
			return;
		}
		sendRawMessage(text, image);
		res.type('json').end(getResponse(0));
		console.log(`${getTime()} webhook 调用成功`);
	})
	.listen(config.webhook.port, '0.0.0.0');
