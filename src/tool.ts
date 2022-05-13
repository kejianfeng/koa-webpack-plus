import * as Joi from 'joi'


const validate =  (options:any) => {
  const keys = {
    webpackConfig: [Joi.object()],
    config: [Joi.object().allow(null)],
    configPath: [Joi.string().allow(null)],
    devMiddleware: [Joi.object().allow(null)],
    hotMiddleware: [Joi.object().allow(null)],
  };
  const schema = Joi.object().keys(keys);
  const results = schema.validate(options);

  return results;
}

export {
  validate,
}