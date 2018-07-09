const http = require('http');
const https = require('https');
const fs = require("fs")
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const router = require('koa-router')();
const app = new Koa();
const WebSocket = require('ws');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost/wamars');


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('open MongoDB')
    // yay!
});
var impressionSchema = mongoose.Schema({
    name: { type: String },
    age:{type:Number},
});
var impressionModel = mongoose.model('aaa', impressionSchema);
impressionModel.create([
        {
            name: 'marsaaaa',
            age:311
        }
    ],(err,doc)=>{
        if(err){
            console.error(err);
        } else {
            console.log(["SUCCESS"]);
            console.log(doc);
        }
    })
impressionModel.find((err, docs) => {
    if (err) return console.log(err)
    console.log(docs,'sss')
})

const marss = async (name) => {
    console.log('marss name',name)
    var re = new RegExp("^"+name);
    console.log(re)
    const query = impressionModel.find({ name: re })
    console.log(typeof query.exec)
    let reslist = null;
    reslist = await query.exec()
    return reslist
}

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

router.post('/api/key', async (ctx, next) => {
    // console.log(ctx.request)
    // console.log(ctx.request.body,'body')

    var name = ctx.params.name;

    var data = await marss(ctx.request.body.name)
    console.log(data, '444444')
    ctx.response.body = {
        success: true,
        data,
    };
});
app.use(bodyParser());
app.use(router.routes());

const options = {
    key: fs.readFileSync('./ssl/private.key', 'utf8'),
    cert: fs.readFileSync('./ssl/private.pem', 'utf8')
}

http.createServer(app.callback()).listen(8989);
// https.createServer(options, app.callback()).listen(443);
