import { Options } from 'tsup';

declare type AutoxDeployAction = 'none' | 'both' | 'save' | 'rerun';

declare class AutoxDeployExecutor {
    private static DIST_PATH;
    private static MAIN_PATH;
    private deployAction?;
    constructor(deployAction?: AutoxDeployAction);
    private sendDeployCmd;
    private getDistPath;
    private getMainPath;
    private execRerunCmd;
    private execSaveCmd;
    setDeployAction(deployAction?: AutoxDeployAction): void;
    getDeployAction(): AutoxDeployAction;
    getDeployName(projectName?: string): string;
    execDeployProject(projectName?: string): void;
}

declare type TsupNodeEnv = 'production' | 'development';
declare class TsupConfigBuilder {
    private static NODE_ENV_KEY;
    private static IS_WATCH_KEY;
    private static DEPLOY_ACTION_KEY;
    private static PROJECT_NAME_KEY;
    private overrideOptions;
    private deployExecutor;
    constructor(overrideOptions: Options);
    private getOverrideEnv;
    private getNodeEnv;
    private isProdEnv;
    private getIsWatch;
    private getDeployAction;
    private getProjectName;
    private buildDefineObject;
    buildDefineConfig(packageName?: string): Options;
    static withNewConfig(overrideOptions: Options, packageName?: string): Options;
}

export { AutoxDeployAction, AutoxDeployExecutor, TsupConfigBuilder, TsupNodeEnv };
