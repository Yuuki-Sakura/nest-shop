import crypto from 'crypto';
import { Request } from 'express';
import UAParser from 'ua-parser-js';
import LanguageParser from 'accept-language-parser';

export const createDeviceHash = (
  req: Request,
  append?: Record<string, any>,
) => {
  const userLanguages = LanguageParser.parse(req.header('accept-language'));
  const userAgent = UAParser(req.header('user-agent'));
  return crypto
    .createHash('sha256')
    .update(
      JSON.stringify({
        languages: userLanguages,
        ua: {
          browser: {
            name: userAgent.browser.name,
          },
          engine: {
            name: userAgent.engine.name,
          },
          os: {
            name: userAgent.os.name,
          },
          device: userAgent.device,
          cpu: userAgent.cpu,
        } as UAParser.IResult,
        httpVersion: req.httpVersion,
        ...append,
      }),
    )
    .digest('hex');
};
