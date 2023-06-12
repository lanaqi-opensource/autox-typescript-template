import { defineConfig, Options as TsupOptions } from 'tsup';

import { TsupConfigBuilder } from './build/TsupConfigBuilder';

// @ts-ignore
import { name as packageName } from './package.json';

export default defineConfig((overrideOptions: TsupOptions) =>
    TsupConfigBuilder.withNewConfig(
        overrideOptions,
        [
        ],
        [
            'common-tags',
        ],
        packageName,
        true,
        // TsupConfigBuilder.ASSETS_PATH_PREFIX,
    ),
);
