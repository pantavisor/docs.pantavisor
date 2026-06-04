#!/usr/bin/env node
// Lists the reference versions configured in releases.json.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const { current, versions } = JSON.parse(readFileSync(join(ROOT, 'releases.json'), 'utf8'));

for (const v of versions) console.log(`${v === current ? '* ' : '  '}${v}`);
