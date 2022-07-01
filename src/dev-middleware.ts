//@ts-nocheck
import wdm from'webpack-dev-middleware'
export default (compiler, option) =>  {
  const expressMiddleware = wdm(compiler, option);
  async function koaMiddleware(ctx, next) {
    const { req } = ctx;
    const locals = ctx.locals || ctx.state;

    ctx.webpack = expressMiddleware;
    ctx.compiler = compiler;

    const runNext = await new Promise(resolve => {
      expressMiddleware(
        req,
        {
          locals,
          send(body) {
            ctx.body = body;
            resolve(0);
          },
          set(field, value) {
            ctx.response.set(field, value);
          },
          get(field) {
            return ctx.response.get(field);
          },
        },
        () => {
          resolve(1);
        }
      );
    });

    if (runNext) {
      await next();
    }
  }

  Object.keys(expressMiddleware).forEach(p => {
    koaMiddleware[p] = expressMiddleware[p];
  });

  return koaMiddleware;
};
