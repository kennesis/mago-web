import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';


const content = readFileSync(join('.', 'package.json')).toString();
const result = JSON.parse(content) as Record<string, unknown>;

result.name = (result.name as string).replace('@marching/', '@marchingy/');
writeFileSync(join('.', 'package.json'), JSON.stringify(result, null, 2));