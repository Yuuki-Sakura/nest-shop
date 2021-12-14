import Ajv, { ErrorObject } from 'ajv';
import merge from 'deepmerge';
import { fileLoader, TypedConfigModule } from 'nest-typed-config/index';

export const schemaValidator = <T>(rawConfig: T): T => {
  const schema = fileLoader({
    basename: 'nest-shop-config.schema',
  })();
  const validate = new Ajv({
    allowUnionTypes: true,
    verbose: true,
  }).compile(schema);
  validate(rawConfig);
  if (validate.errors) {
    throw new Error(
      TypedConfigModule.getConfigErrorMessage(
        validate.errors
          .reduce((prev: ErrorObject[], current) => {
            const findIndex = prev.findIndex(
              (item) => item.instancePath === current.instancePath,
            );
            if (findIndex === -1) {
              prev.push(current);
            } else {
              const error = prev[findIndex];
              const mergedParams = merge(error.params, current.params);
              prev.splice(findIndex, 1, {
                ...error,
                params: mergedParams,
              });
            }
            return prev;
          }, [])
          .map((item) => ({
            property: item.instancePath,
            value: item.data,
            constraints: item.params,
          })),
      ),
    );
  }
  return rawConfig;
};
