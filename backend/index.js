const Koa = require('koa');
const { bodyParser } = require('@koa/bodyparser');
const cors = require('@koa/cors');
const { mainRouter } = require('./src/routes/index');
const config = require('./config.json');
const { connectToDatabase, runMigrations } = require('./src/db');
const app = new Koa();

const port = config.port || 4000;

app.use(bodyParser());

app.use(async (ctx, next) => {
    console.log(ctx.method, ctx.url);
    try{
        await next();
    } catch (err) {
        ctx.response.status = err.status || 500;
        ctx.response.body = err.message;
        console.error(err);
    }
})

app.use(cors());

app.use(mainRouter.routes())
    .use(mainRouter.allowedMethods());

const httpServer = require("http").createServer(app.callback());
httpServer.listen(port, async (error) => {
    if (error) {
        console.log('Error while trying to open server.', error);
        return;
    }
    await connectToDatabase(config.databaseConfig);
    await runMigrations();

    console.log(`Server started on port`, port);
});