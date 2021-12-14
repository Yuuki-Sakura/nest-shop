import { AppConfig } from '@/app.config';
import { WinstonLogger } from '@/common/logger/winston.logger';
import { schemaValidator } from '@/common/utils/schema-validator';
import { Logger } from '@nestjs/common';
import type {
  OptionsSync,
  cosmiconfigSync as _cosmiconfigSync,
} from 'cosmiconfig';
import { CosmiconfigResult } from 'cosmiconfig/dist/types';
import deepProxy from 'deep-proxy-polyfill';
import { loadPackage } from 'nest-typed-config/dist/utils/load-package.util';
import { basename, dirname } from 'path';
import chokidar from 'chokidar';
import { diff } from 'deep-diff';
import _ from 'lodash';

let parseToml: any;
let cosmiconfig: any;

const loadToml = function loadToml(filepath: string, content: string) {
  parseToml = loadPackage(
    '@iarna/toml',
    "fileLoader's ability to parse TOML files",
  ).parse;
  try {
    return parseToml(content);
  } catch (error: any) {
    error.message = `TOML Error in ${filepath}:\n${error.message}`;
    throw error;
  }
};

export interface FileLoaderOptions extends Partial<OptionsSync> {
  /**
   * basename of config file, defaults to `.env`.
   *
   * In other words, `.env.yaml`, `.env.yml`, `.env.json`, `.env.toml`, `.env.js`
   * will be searched by default.
   */
  basename?: string;
  /**
   * Use given file directly, instead of recursively searching in directory tree.
   */
  absolutePath?: string;
  /**
   * The directory to search from, defaults to `process.cwd()`. See: https://github.com/davidtheclark/cosmiconfig#explorersearch
   */
  searchFrom?: string;
}

const getSearchOptions = (options: FileLoaderOptions) => {
  if (options.absolutePath) {
    return {
      searchPlaces: [basename(options.absolutePath)],
      searchFrom: dirname(options.absolutePath),
    };
  }
  const { basename: name = '.env', loaders = {} } = options;
  const additionalFormats = Object.keys(loaders).map((ext) => ext.slice(1));

  const formats = [...additionalFormats, 'toml', 'yaml', 'yml', 'json', 'js'];
  return {
    searchPlaces: [
      ...formats.map((format) => `${name}.${process.env.NODE_ENV}.${format}`),
      ...formats.map((format) => `${name}.${format}`),
    ],
    searchFrom: options.searchFrom,
  };
};

/**
 * File loader loads configuration with `cosmiconfig` from file system.
 *
 * It is designed to be easy to use by default:
 *  1. Searching for configuration file starts at `process.cwd()`, and continues
 *     to search up the directory tree until it finds some acceptable configuration.
 *  2. Various extensions are supported, such as `.json`, `.yaml`, `.toml`, `.js` and `.cjs`.
 *  3. Configuration base name defaults to .env (so the full name is `.env.json` or `.env.yaml`),
 *     separate file for each environment is also supported. For example, if current `NODE_ENV` is
 *     development, `.env.development.json` has higher priority over `.env.json`.
 *
 * @see https://github.com/davidtheclark/cosmiconfig
 * @param options cosmiconfig initialize options. See: https://github.com/davidtheclark/cosmiconfig#cosmiconfigoptions
 */
export const watchFileLoader = (
  options: FileLoaderOptions = {},
): (() => Record<string, any>) => {
  cosmiconfig = loadPackage('cosmiconfig', 'fileLoader');
  Logger.overrideLogger(WinstonLogger);
  const logger: Logger = new Logger('ConfigLoader');

  const { cosmiconfigSync } = cosmiconfig;
  const { searchPlaces, searchFrom } = getSearchOptions(options);
  const loaders = {
    '.toml': loadToml,
    ...options.loaders,
  };
  type ConfigLoadResult = {
    config: AppConfig;
  } & Omit<CosmiconfigResult, 'config'>;
  function loadFile(): ConfigLoadResult {
    const explorer = cosmiconfigSync('env', {
      searchPlaces,
      ...options,
      loaders,
    }) as ReturnType<typeof _cosmiconfigSync>;
    const result = explorer.search(searchFrom);

    if (!result) {
      throw new Error(`Failed to find configuration file.`);
    }
    return result;
  }
  return (): Record<string, any> => {
    const result = loadFile();
    logger.log(
      `File-loader has loaded a configuration file from ${result.filepath}`,
    );
    chokidar
      .watch(result.filepath, {
        persistent: true,
      })
      .on('change', () => {
        try {
          const newConfig = schemaValidator(loadFile().config);
          const oldConfig = result.config;
          const differences = diff(oldConfig, newConfig);
          differences?.forEach((item) => {
            switch (item.kind) {
              case 'N':
                logger.log(item);
                break;
              case 'D':
                logger.log(item);
                break;
              case 'E':
                logger.log(item);
                break;
              case 'A':
                logger.log(item);
                break;
            }
          });
          logger.log(differences);
          result.config = newConfig;

          logger.log(
            `File-loader has reloaded a configuration file from ${result.filepath}`,
          );
        } catch (e) {
          logger.error(e.message, e, 'ConfigLoader');
        }
      });
    return deepProxy(result.config, {
      get: (obj, key, root, keys) => {
        if (keys?.length == 0) {
          return result.config[key];
        }
        const res = _.get(result.config, keys)[key];
        if (res.constructor == Array) {
          return new Proxy(res, {
            get: (target, p) => {
              return _.get(result.config, keys)[key][p];
            },
          });
        }
        return res;
      },
    });
  };
};
