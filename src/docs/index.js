import YAML from 'yaml';
import fs from 'fs';

const swaggerDocument = YAML.parse(fs.readFileSync(__dirname + '/swagger.yaml', 'utf-8'));

export default {
    ...swaggerDocument
} 
