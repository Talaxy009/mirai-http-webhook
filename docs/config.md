# 设置文件介绍

一个默认的设置文件应该如下

```json
{
    "mirai": {
        "host": "http://127.0.0.1:8080",
        "verifyKey": "",
        "qq": 123456,
        "enableWebsocket": false
    },
    "bot": {
        "target": 0,
        "isGroup": false
    },
    "webhook": {
        "token": "abcd",
        "port": 5050
    }
}
```

## mirai 分支（连接相关）

- host——mirai-api-http 的地址和端口，默认是 `http://127.0.0.1:8080`
- verifyKey——mirai-api-http 的 authKey（建议手动指定）
- qq——当前 BOT 对应的 QQ 号
- enableWebsocket——是否启用 Websocket（需要和 mirai-api-http 的设置一致）

## bot 分支（机器人设置相关）

- target——需要发送消息到的目标，可以是群或者好友（机器人连接成功或 webhook 调用成功都会发送消息到此目标）
- isGroup——是否为群组类型

## webhook 分支

- token——接口调用 token（若不配置则调用无需 token）
- port——监听端口
