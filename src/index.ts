import { join } from "path";
import * as root from "app-root-path";
import  chalk from "chalk";
import  webpack, {Configuration, HotModuleReplacementPlugin} from "webpack";
import  ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import  { merge }  from 'webpack-merge';
import  compose from "koa-compose";
import getDevMiddleware from "./dev-middleware"
import getHotMiddleware from "./hot-middleware"
import { validate } from "./tool"

const defaults = { devMiddleware: {}, hotMiddleware: {} };

interface IDevMiddleware {
  methods?: string[];
  headers?: any[] | object | Function;
  index?: boolean | string;
  mimeTypes?: object;
  publicPath?: string | undefined | object;
  stats?: boolean | string | object;
  serverSideRender?: boolean;
  writeToDisk?: boolean;
  outputFileSystem?: object;
}
interface IHotMiddleware {
  path?: string;
  name?: string;
  timeout?: number;
  overlay?: boolean;
  reload?: boolean;
  noInfo?: boolean;
  quiet?: boolean;
  dynamicPublicPath?: boolean;
  autoConnect?: boolean;
  ansiColors?: object;
  overlayStyles?: object;
  overlayWarnings?: boolean;
}

interface IOptions {
  webpackConfig: Configuration ;
  devMiddleware?: IDevMiddleware;
  hotMiddleware?: IHotMiddleware;
  [key: string]: any;
}

type IEntry = string | string[] | Record<string, string | string[]>
export default async (opts: IOptions) => {
  const valid = validate(opts);

  if (valid.error) {
    console.error(
      chalk.red("⬢ koa-webpack-plus:"),
      "An option was passed to koa-webpack that is not valid"
    );
    throw valid.error;
  }

  const options = Object.assign({}, defaults, opts);
  
  let { webpackConfig } = options;
  if (!webpackConfig) {
    webpackConfig = require(options.configPath ||
        join(root.path, "webpack.config.js"));
  }

  if (!webpackConfig) {
    console.error(
      chalk.red("⬢ koa-webpack-plus:"),
      "webpackConfig is empty!"
    );
    return
  }
  /**
   * 用于往入口文件添加hot-middleware文件
   * @param entry 入口文件
   */
  const addHotMiddlewareEntry = (entry: IEntry) => {
    const entryType:string = Object.prototype.toString.apply(entry)
    switch (entryType) {
      case '[object String]':
        webpackConfig.entry = [ 'webpack-hot-middleware/client', entry as string]
        break;
      case '[object Array]':
        (webpackConfig.entry as string[]).unshift('webpack-hot-middleware/client')
        break;
      case '[object Object]':
        const indexEntryKey = Object.keys(webpackConfig.entry as object)[0]
        //@ts-ignore
        let indexEntry: string | string[] = webpackConfig.entry[indexEntryKey]
        let _entryType = Object.prototype.toString.apply(indexEntry)
        if(_entryType === '[object String]' ) {
            //@ts-ignore
          webpackConfig.entry[indexEntryKey] = [ 'webpack-hot-middleware/client', indexEntry]
        }
        if (_entryType === '[object Array]' ) {
            //@ts-ignore
          webpackConfig.entry[indexEntryKey].unshift('webpack-hot-middleware/client')
        }
        break;
      default:
        break;
    }
  }
  //添加入口热更新文件
  addHotMiddlewareEntry(webpackConfig.entry as IEntry)
  const finalConfig:Configuration = merge(webpackConfig, {
    mode:'development',
    watch:true,
    plugins: [
      new HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin({
        exclude: /node_modules/,
        overlay: {
          sockIntegration: 'whm',
        },
      })  
    ],
  })


  let compiler = webpack(finalConfig)

  if (!options.devMiddleware.publicPath) {
    const { publicPath } = compiler.options.output;
    if (!publicPath) {
      throw new Error(
        "koa-webpack: publicPath must be set on `dev` options, or in a compiler's `output` configuration."
      );
    }
    options.devMiddleware.publicPath = publicPath;
  }

  const hotMiddleware = getHotMiddleware(compiler, options.hotMiddleware);
  const devMiddleware = getDevMiddleware(compiler, options.devMiddleware);
  return compose([devMiddleware, hotMiddleware]);
};
