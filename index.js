const Mirai = require('node-mirai-sdk');
const http = require('http');
const {URL} = require('url');
const config = require('./config.json');

const bot = new Mirai(config.mirai);
const {Plain, Image} = Mirai.MessageComponent;
const getTime = () => new Date().toLocaleString();

bot.onSignal('authed', () => {
	console.log(`${getTime()} 通过: ${bot.sessionKey} 认证中···`);
	bot.verify();
});

bot.onSignal('verified', ()=>{
	const messageChain = [Plain('Webhook 已启用')];
	if (config.bot.admin) {
		bot.sendFriendMessage(messageChain, config.bot.admin);
	}
});

const server = http.createServer((req, res) => {
	const {searchParams} = new URL(req.url, 'http://localhost/');
	const token = searchParams.get('token');
	const text = searchParams.get('text');
	const image = searchParams.get('image');

	let result = {
		err: 0,
		msg: 'success',
	};

	if (config.webhook.token.length && config.webhook.token !== token) {
		result = {
			err: 1,
			msg: 'token',
		};
	} else {
		let messageChain = [];
		if (text.length) {
			messageChain.push(Plain(text));
		}
		if (image.length) {
			messageChain.push(Image({url: image}));
		}
		bot.sendFriendMessage(messageChain, config.bot.admin);
	}

	res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
	res.end(result);
});

server.listen(config.webhook.port, '0.0.0.0');
