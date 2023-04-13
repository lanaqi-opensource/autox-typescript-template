// https://tsup.egoist.dev/
// https://paka.dev/npm/tsup@6.7.0/api#1bba6aac2221bff5

import { Options as TsupOptions } from 'tsup';

import { AutoxDeployAction, AutoxDeployExecutor } from './AutoxDeployExecutor';

// Tsup 运行环境
export declare type TsupNodeEnv = 'production' | 'development';

// Tsup 配置构建器
export class TsupConfigBuilder {

    // 运行环境
    private static NODE_ENV_KEY: string = 'NODE_ENV';

    // 是否监视
    private static IS_WATCH_KEY: string = 'IS_WATCH';

    // 部署动作
    private static DEPLOY_ACTION_KEY: string = 'DEPLOY_ACTION';

    // 项目名称
    private static PROJECT_NAME_KEY: string = 'PROJECT_NAME';

    // 覆盖可选
    private overrideOptions: TsupOptions;

    // 部署执行器
    private deployExecutor: AutoxDeployExecutor;

    public constructor(overrideOptions: TsupOptions) {
        this.overrideOptions = overrideOptions;
        this.deployExecutor = new AutoxDeployExecutor(this.getDeployAction());
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

    // 获取是否监视
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
            'injectAssetsPath': isProd ? '"."' : `"/sdcard/脚本/${projectName}"`,
            'injectProjectName': `'${projectName}'`
        };
    }

    // 构建定义配置
    // 单项目结构：./.vscode/ | ./build/ | ./lib/ | ./node_modules/ | ./types/ | ./src/ |
    // 多项目结构：./.vscode/ | ./build/ | ./lib/ | ./node_modules/ | ./types/ | ./src/${projectName} | 
    public buildDefineConfig(packageName?: string): TsupOptions {
        const isOne = Boolean(packageName);
        const projectName = isOne ? packageName as string : this.getProjectName();
        const isProd = this.isProdEnv();
        const isWatch = this.getIsWatch();
        let entryFiles: string[];
        let watchSrc: string;
        let publicDir: string;
        if (isOne) {
            entryFiles = [
                './src/main.ts',
            ];
            watchSrc = './src/';
            publicDir = './src/assets/';
        } else {
            entryFiles = [
                `./src/${projectName}/main.ts`,
            ];
            watchSrc = `./src/${projectName}/`;
            publicDir = `./src/${projectName}/assets/`;
        }
        return {
            name: projectName,
            entry: entryFiles,
            target: 'es5',
            minify: isProd,
            watch: isWatch ? [
                watchSrc,
                './lib/',
            ] : false,
            ignoreWatch: [
                './.vscode/',
                './build/',
                './types/',
            ],
            onSuccess: async () => {
                this.deployExecutor.execDeployProject(projectName);
            },
            outDir: `dist/${projectName}`,
            replaceNodeEnv: true,
            clean: true,
            tsconfig: 'tsconfig.json',
            publicDir: publicDir,
            define: this.buildDefineObject(isProd, projectName),
        }
    }

    // 使用新的配置
    public static withNewConfig(overrideOptions: TsupOptions, packageName?: string): TsupOptions {
        return new TsupConfigBuilder(overrideOptions).buildDefineConfig(packageName);
    }

}
