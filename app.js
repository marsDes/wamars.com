const Koa = require('koa');
const app = new Koa();
const WebSocket = require('ws');
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
const WebSocketServer = WebSocket.Server;

let server = app.listen(80);

// 创建WebSocketServer:
let wss = new WebSocketServer({
    server: server
});
wss.on('connection', function (ws) {
    console.log(`[SERVER] connection()`);
    ws.on('message', function (message) {
        console.log(`[SERVER] Received: ${message}`);
        ws.send(message, (err) => {
            if (err) {
                console.log(`[SERVER] error: ${err}`);
            }
        });
    })
});