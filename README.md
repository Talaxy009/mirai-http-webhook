# mirai-http-webhook

通过 mirai-api-http 来实现 webhook 功能

注意：

- 本项目仍在开发中，若遇到问题请提交至 issues
- 已适配至 2.0 的 [mirai-api-http](https://github.com/project-mirai/mirai-api-http/)，请检查 `config.json` 字段名是否与 [config.default.json](./config.default.json) 的一致

## 使用方式

1. 克隆本项目 `git clone https://github.com/Talaxy009/mirai-http-webhook.git`
2. 移动到本地仓库 `cd ./mirai-http-webhook`
3. 安装依赖 `npm install` 或 `yarn`
4. 复制一份 `config.default.json` 修改名字为 `config.json` 后对其进行编辑，设置文件相关说明在此 → [点我](./docs/config.md)
5. 启动 `npm start`

## 接口调用说明

### 请求方式：`GET`

请求示例：`http://host:port?token=abcd&text=测试&image=https://bkimg.cdn.bcebos.com/pic/6609c93d70cf3bc79f3ded3c434bada1cd11738bfc82`

| 参数名 | 类型            | 方式  | 说明                                                     |
| ------ | --------------- | ----- | -------------------------------------------------------- |
| token  | string (非必须) | query | 需要与配置文件中的 token 一致，若没有配置 token 可以不传 |
| text   | string (非必须) | query | 需要发送的文字信息                                       |
| image  | string (非必须) | query | 需要发送的图片的 URL                                     |

### 请求方式：`POST`

请求头必须带有 `Content-Type` , `text/plain` 或 `application/json`

#### `Content-Type: text/plain`

请求格式：`http://host:port?token=abcd`, Body 为 需要发送的文字信息，等价于 `GET` 方式的 `text`

请求示例：`curl -H 'Content-Type: text/plain' -d '测试' -X POST http://host:port?token=abcd`

| 参数名 | 类型            | 方式  | 说明                                                     |
| ------ | --------------- | ----- | -------------------------------------------------------- |
| token  | string (非必须) | query | 需要与配置文件中的 token 一致，若没有配置 token 可以不传 |

#### `Content-Type: application/json`

请求格式：`http://host:port[?token=abcd]`

Body：`{ "token": "", "text": "", "image": "" }`

请求示例：`curl -H 'Content-Type: application/json' -d '{ "token": "abcd", "text": "测试", "image": "https://bkimg.cdn.bcebos.com/pic/6609c93d70cf3bc79f3ded3c434bada1cd11738bfc82" }' -X POST http://host:port`

请求示例：`curl -H 'Content-Type: application/json' -d '{ "text": "测试", "image": "https://bkimg.cdn.bcebos.com/pic/6609c93d70cf3bc79f3ded3c434bada1cd11738bfc82" }' -X POST http://host:port?token=abcd`

| 参数名 | 类型            | 方式          | 说明                                                     |
| ------ | --------------- | ------------- | -------------------------------------------------------- |
| token  | string (非必须) | query 或 body | 需要与配置文件中的 token 一致，若没有配置 token 可以不传 |
| text   | string (非必须) | body          | 需要发送的文字信息                                       |
| image  | string (非必须) | body          | 需要发送的图片的 URL                                     |

## 返回说明

返回类型：`application/json;charset=utf-8`

返回示例：

```json
{"err": 0, "msg": "success"}
```

| err | msg                | 说明                                           |
| --- | ------------------ | ---------------------------------------------- |
| 0   | success            | 调用成功                                       |
| 1   | token invalid      | 未发送 token 或发送 token 与服务端的不匹配     |
| 2   | unsupported method | 不支持的请求方式                               |
| 3   | server error       | 由于某种原因导致流程异常，包括但不限于传参有误 |

## TODO 🕊

- [x] ~~实现对 post 请求的处理~~ (感谢 [Anankke](https://github.com/Anankke))
- [x] ~~适配 mirai-api-http 2.0~~
- [ ] 支持调用接口时指定发送对象
