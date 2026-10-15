import type { AreaDef } from './types';
import { HEM } from './areas/hem';
import { MOTEN } from './areas/moten';
import { BYAR } from './areas/byar';
import { GROTTOR } from './areas/grottor';
import { SMAPLATSER } from './areas/smaplatser';
import { KRYPTA } from './areas/krypta';
import { GRUVAN } from './areas/gruvan';
import { KVARNEN } from './areas/kvarnen';
import { FYREN } from './areas/fyren';
import { FOLKPARKEN } from './areas/folkparken';
import { FABODSKOGEN } from './areas/fabodskogen';
import { TROLLBERGET } from './areas/trollberget';
import { PASSAGER } from './areas/passager';
import { SJON } from './areas/sjon';

/**
 * Side-view areas. See data/legend.ts for what the characters mean.
 * Rows must all have the same width (checked by tests/data.test.ts).
 *
 * The rooms live in data/areas/, one file per region or temple.
 */
export const AREA_GROUPS: ReadonlyArray<Record<string, AreaDef>> = [HEM, MOTEN, BYAR, GROTTOR, SMAPLATSER, KRYPTA, GRUVAN, KVARNEN, FYREN, FOLKPARKEN, FABODSKOGEN, TROLLBERGET, PASSAGER, SJON];

export const AREAS: Record<string, AreaDef> = Object.assign({}, ...AREA_GROUPS);
