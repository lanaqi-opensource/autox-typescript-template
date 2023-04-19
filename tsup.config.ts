import { Options as TsupOptions, defineConfig } from 'tsup';

import { name as packageName } from './package.json';

import { TsupConfigBuilder } from './build/TsupConfigBuilder';

export default defineConfig((overrideOptions: TsupOptions) =>
    TsupConfigBuilder.withNewConfig(
        overrideOptions, [], packageName
    )
);
