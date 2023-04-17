// https://tsup.egoist.dev/

import { Options as TsupOptions } from 'tsup';

import { AutoxDeployAction, AutoxDeployExecutor } from './AutoxDeployExecutor';

// Tsup 运行环境
export declare type TsupNodeEnv = 'production' | 'development';

// Tsup 非外部库
export declare type TsupNoExternal = (string | RegExp)[];

// Tsup 配置构建器
export class TsupConfigBuilder {

    // 运行环境
    private static NODE_ENV_KEY: string = 'NODE_ENV';

    // 是否监控变动
    private static IS_WATCH_KEY: string = 'IS_WATCH';

    // 部署动作
    private static DEPLOY_ACTION_KEY: string = 'DEPLOY_ACTION';

    // 项目名称
    private static PROJECT_NAME_KEY: string = 'PROJECT_NAME';

    // 资源值前缀（非打包时，部署的资源路径）
    private static ASSETS_PATH_PREFIX: string = '/sdcard/脚本';

    // 覆盖可选
    private overrideOptions: TsupOptions;

    // 部署执行器
    private deployExecutor: AutoxDeployExecutor;

    public constructor(overrideOptions: TsupOptions) {
        this.overrideOptions = overrideOptions;
        this.deployExecutor = new AutoxDeployExecutor();
    }

    // 获取覆盖环境
    private getOverrideEnv(envName: string): undefined | string {
        if (this.overrideOptions.env) {
            return this.overrideOptions.env[envName];
        } else {
            return undefined;
        }
    }

    // 获取运行环境
    private getNodeEnv(): TsupNodeEnv {
        const nodeEnv = this.getOverrideEnv(TsupConfigBuilder.NODE_ENV_KEY);
        if (nodeEnv) {
            return nodeEnv as TsupNodeEnv;
        } else {
            return 'development';
        }
    }

    // 是否生产环境
    private isProdEnv(): boolean {
        return 'production' === this.getNodeEnv();
    }

    // 获取是否监控变动
    private getIsWatch(): boolean {
        const isWatch = this.getOverrideEnv(TsupConfigBuilder.IS_WATCH_KEY);
        if (isWatch) {
            return isWatch === 'true';
        } else {
            return false;
        }
    }

    // 获取部署动作
    private getDeployAction(): AutoxDeployAction {
        const deployAction = this.getOverrideEnv(TsupConfigBuilder.DEPLOY_ACTION_KEY);
        if (deployAction) {
            return deployAction as AutoxDeployAction;
        } else {
            return 'none';
        }
    }

    // 获取项目名称
    private getProjectName(): string {
        const projectName = this.getOverrideEnv(TsupConfigBuilder.PROJECT_NAME_KEY);
        if (projectName) {
            return projectName;
        } else {
            return 'unknown';
        }
    }

    // 构建定义对象
    private buildDefineObject(isProd: boolean, projectName: string): Record<string, string> {
        return {
            'injectEnvName': `"${this.getNodeEnv()}"`,
            'injectAssetsPath': isProd ? '"."' : `"${TsupConfigBuilder.ASSETS_PATH_PREFIX}/${projectName}"`,
            'injectProjectName': `'${projectName}'`
        };
    }

    // 构建定义配置
    // 单项目结构：./.vscode/ | ./build/ | ./lib/ | ./node_modules/ | ./types/ | ./src/ |
    // 多项目结构：./.vscode/ | ./build/ | ./lib/ | ./node_modules/ | ./types/ | ./src/${projectName} | 
    public buildDefineConfig(externalLib: TsupNoExternal, packageName?: string): TsupOptions {
        const isOne = Boolean(packageName);
        const isProd = this.isProdEnv();
        const isWatch = this.getIsWatch();
        const projectName = isOne ? packageName as string : this.getProjectName();
        const deployAction = this.getDeployAction();
        // 非外部库（引用会打包）
        const noExterna: TsupNoExternal = [
            // 框架引用库
            'common-tags',
        ];
        // 入口文件
        let entryFiles: string[];
        // 监控变动源码目录
        let watchSrcDir: string;
        // 资源目录
        let assetsDir: string;
        // 忽略监控变动静态目录
        let ignoreWatchStatics: string;
        if (Array.isArray(externalLib) && externalLib.length > 0) {
            noExterna.push(...externalLib);
        }
        if (isOne) {
            entryFiles = [
                './src/main.ts',
            ];
            watchSrcDir = './src/';
            assetsDir = './src/assets/';
            ignoreWatchStatics = './src/static/';
        } else {
            entryFiles = [
                `./src/${projectName}/main.ts`,
            ];
            watchSrcDir = `./src/${projectName}/`;
            assetsDir = `./src/${projectName}/assets/`;
            ignoreWatchStatics = `./src/${projectName}/static/`;
        }
        return {
            name: projectName,
            entry: entryFiles,
            target: 'es5',
            minify: isProd,
            watch: isWatch ? [
                watchSrcDir,
                './lib/',
            ] : false,
            ignoreWatch: [
                './.vscode/',
                './build/',
                './types/',
                ignoreWatchStatics,
            ],
            onSuccess: async () => {
                this.deployExecutor.execDeployProject(deployAction, projectName);
            },
            outDir: `dist/${projectName}`,
            define: this.buildDefineObject(isProd, projectName),
            noExternal: noExterna,
            replaceNodeEnv: true,
            clean: true,
            tsconfig: 'tsconfig.json',
            publicDir: assetsDir,
            platform: 'node',
            loader: {
                // 把所有图片后缀使用 base64 加载器
                '.jpg': 'base64',
                '.jpeg': 'base64',
                '.ico': 'base64',
                '.gif': 'base64',
                '.svg': 'base64',
                '.svgz': 'base64',
                '.webp': 'base64',
                '.png': 'base64',
                '.bmp': 'base64',
                // 把所有 .txt / .text 使用 text 加载器
                '.md': 'text',
                '.txt': 'text',
                '.text': 'text',
                // 把所有 .htm / .html 使用 text 加载器
                '.htm': 'text',
                '.html': 'text',
            },
            plugins: [
                // 把所有 "ui"; 删除，或使用 ui.xx 时，在顶部添加 "ui"; 声明
                {
                    name: 'replace-ui-declare',
                    renderChunk: async (compileCode, chunkInfo) => {
                        if (compileCode.lastIndexOf('"ui";') > 0 || compileCode.lastIndexOf("'ui';") > 0 || compileCode.lastIndexOf('ui.') > 0) {
                            return {
                                code: `"ui";\n${compileCode.replace('"ui";', '').replace("'ui';", '')}`,
                                map: chunkInfo.map,
                            };
                        } else {
                            return {
                                code: compileCode,
                                map: chunkInfo.map,
                            };
                        }
                    },
                }
            ],
        }
    }

    // 使用新的配置
    public static withNewConfig(overrideOptions: TsupOptions, externalLib: TsupNoExternal, packageName?: string): TsupOptions {
        return new TsupConfigBuilder(overrideOptions).buildDefineConfig(externalLib, packageName);
    }

}
