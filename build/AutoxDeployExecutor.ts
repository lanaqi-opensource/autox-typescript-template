// https://github.com/kkevsekk1/AutoxDeployWebpackPlugin/blob/main/index.js

import nodeHttp from 'http';
import nodePath from 'path';

// Autox 部署动作
export declare type AutoxDeployAction = 'none' | 'both' | 'save' | 'rerun';

// Autox 部署执行器
export class AutoxDeployExecutor {

    // 输出目录值
    private static DIST_PATH: string = './dist';

    // 输出主文件值
    private static MAIN_PATH: string = './main.js';

    // 部署动作
    private deployAction?: AutoxDeployAction;

    public constructor(deployAction?: AutoxDeployAction) {
        this.setDeployAction(deployAction);
    }

    // 发送部署命令
    private sendDeployCmd(execCmd: string, sendPath: string, deployName: string): void {
        const req = nodeHttp.get(`http://127.0.0.1:9317/exec?cmd=${execCmd}&path=${encodeURI(sendPath)}`, (res) => {
            res.setEncoding('utf8');
            res.addListener('data', (data) => {
                console.debug('部署执行器: %s -> 执行命令成功！- data: %s', deployName, data);
            }).addListener('error', (error) => {
                console.error('部署执行器: %s -> 执行命令失败！- error: %s', deployName, error);
            });
        });
        req.addListener('finish', () => {
            console.debug('部署执行器: %s -> 发送命令成功! - cmd: %s ; path: %s', deployName, execCmd, sendPath);
        });
        req.addListener('error', (error) => {
            console.error('部署执行器: %s -> 发送命令失败！- error: %s', deployName, error);
        });
    }

    // 获取输出目录值
    private getDistPath(deployName: string): string {
        return `/${nodePath.resolve(AutoxDeployExecutor.DIST_PATH, deployName)}`;
    }

    // 获取输出主文件值
    private getMainPath(deployName: string): string {
        return `/${nodePath.resolve(AutoxDeployExecutor.DIST_PATH, deployName, AutoxDeployExecutor.MAIN_PATH)}`;
    }

    // 执行重新运行命令
    private execRerunCmd(deployName: string): void {
        this.sendDeployCmd('rerun', this.getMainPath(deployName), deployName);
    }

    // 执行保存命令
    private execSaveCmd(deployName: string): void {
        this.sendDeployCmd('save', this.getDistPath(deployName), deployName);
    }

    // 设置部署动作
    public setDeployAction(deployAction?: AutoxDeployAction): void {
        if (deployAction) {
            this.deployAction = deployAction;
        } else {
            this.deployAction = 'none';
        }
    }

    // 获取部署动作
    public getDeployAction(): AutoxDeployAction {
        if (this.deployAction) {
            return this.deployAction;
        } else {
            return 'none';
        }
    }

    // 获取部署名称
    public getDeployName(projectName?: string): string {
        if (projectName) {
            return projectName;
        } else {
            return 'unknown';
        }
    }

    // 执行部署项目
    public execDeployProject(projectName?: string): void {
        const deployName: string = this.getDeployName(projectName);
        const deployAction: AutoxDeployAction = this.getDeployAction();
        switch (deployAction) {
            case 'save':
                this.execSaveCmd(deployName);
                console.info('部署执行器: %s -> 完成保存！', deployName);
                break;
            case 'rerun':
                this.execRerunCmd(deployName);
                console.info('部署执行器: %s -> 完成重新运行！', deployName);
                break;
            case 'both':
                this.execSaveCmd(deployName);
                this.execRerunCmd(deployName);
                console.info('部署执行器: %s -> 完成保存并重新运行！', deployName);
                break;
            case 'none':
            default:
                console.info('部署执行器: %s -> 没有需要执行的动作！', deployName);
                break;
        }
    }

}
