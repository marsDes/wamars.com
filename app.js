const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const app = new Koa();
const WebSocket = require('ws');
// 静态资源服务器
// const serve = require('koa-static');
// app.use(serve(__dirname+ "/static/html",{ extensions: ['html','png']}));
// app.listen(3000);

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// add url-route:
router.get('/hello/:name', async (ctx, next) => {
    var name = ctx.params.name;
    ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});

router.get('/', async (ctx, next) => {
  ctx.response.body = `<!DOCTYPE html>
    <html>
    <head>
      <title>哇~ Mars</title>
      <meta name="description" content="林建歆前端实验室">
    </head>
    <body>
      <h1>
        Hello Mars
      </h1>
    </body>
    </html>`;
});
app.use(bodyParser());

app.use(router.routes());
let server = app.listen(80);

// 创建WebSocketServer:
const WebSocketServer = WebSocket.Server;
let wss = new WebSocketServer({
    server: server
});
wss.broadcast = function (data) {
    wss.clients.forEach(function (client) {
        client.send(data,err=>{
            if(err){console.log(`[server] error: ${err}`)}
        });
    });
};
wss.on('connection', function (ws) {
    console.log(`[SERVER] connection()`);
    ws.on('message', function (message) {
        if(message && message.trim()){
            console.log(`[SERVER] Received: ${message}`);
            wss.broadcast(message)
        }
    })
});