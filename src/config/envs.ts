import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

export function loadEnv() {
  const env = process.env.NODE_ENV;

  let path;

  switch (env) {
    case 'test':
      path = '.env.test';
      break;
    case 'development':
      path = '.env.development';
      break;
    default:
      path = '.env';
      break;
  }

  const currentEnvs = dotenv.config({ path });
  dotenvExpand.expand(currentEnvs);
}
