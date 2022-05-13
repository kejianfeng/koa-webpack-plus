//@ts-nocheck
const whm  = require('webpack-hot-middleware')
// import whm from 'webpack-hot-middleware'
function middleware(doIt, req, res) {
  const { end: originalEnd } = res;
  return new Promise(resolve => {
    res.end = function end() {
      originalEnd.apply(this, arguments);
      resolve(0);
    };
    doIt(req, res, () => {
      resolve(1);
    });
  });
}

export default (compiler, option) =>  {
  const doIt = whm(compiler, option);
  async function koaMiddleware(ctx , next) {
    const { req, res } = ctx;
    const runNext = await middleware(doIt, req, res);
    if (runNext) {
      await next();    }
  }
  return koaMiddleware;
};