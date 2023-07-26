import { defineConfig, Options as TsupOptions } from 'tsup';

import { TsupConfigBuilder } from './build/TsupConfigBuilder';

// @ts-ignore
import { name as packageName } from './package.json';

export default defineConfig((overrideOptions: TsupOptions) =>
    TsupConfigBuilder.withNewConfig(
        overrideOptions,
        [
        ], // 引用外部库（不打包）
        [
            'common-tags', // 可选库，如果不需要先在 package.json 中删除，再删除该依赖项
        ], // 引用内部库（会打包）
        packageName, // 项目包名
        true, // 是否匹配ui相关内容后自动添加'ui';到第一行
        {}, // 自定义注入变量（Record<string, string>）
        // TsupConfigBuilder.ASSETS_PATH_PREFIX, // 覆盖资源前缀
    ),
);
