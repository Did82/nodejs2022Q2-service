import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { join } from 'path';

export default () => {
  return yaml.load(readFileSync(join(__dirname, '../../doc/api.yaml'), 'utf8'));
};
