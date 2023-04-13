# Autox TypeScript Template

基于 VsCode 开发 TypeScript 工程化的 AutoxJS 模板。

## 目录与文件说明

- build

        这个目录是构建支持，一般情况下不需要修改以及增加。

- lib

        这个目录是编写一些公共特征的库，可以划分模块，如 m1 / m2 然后再 tsconfig.json 文件中添加 paths 内容即可。

        paths:{
            "@lanaqi/m1": [
                './lib/m1/index.ts'
            ]
        }

        其中 index.ts 内容示例如下：

        import A from "./dir/a";

        export {
            A
        };

- src

        这个目录是源码目录，其中 main.ts 是入口文件。
        其中 ./src/assets/ 是资源目录。

        多项目结构：
        ./src/${projectName}/main.ts 以及 ./src/${projectName}/assets/
        另外需要覆盖环境变量：PROJECT_NAME ， 如 -env.PROJECT_NAME=a 这样。
        需要注意的是，多项目时 tsup.config.ts 不需要传递 packageName 参数。

        export default defineConfig((overrideOptions: TsupOptions) => TsupConfigBuilder.withNewConfig(overrideOptions));

        更多参考：./build/ 中实现的源码。

- types

    这个目录是类型声明目录，声明一些公共库或注入变量等。

- dist

    这个目录是构建输出，编译后生成的源码以及资源在这个目录下，这个目录下以项目名方式分类，如下：
    dist/a
    dist/b

- .gitignore

    通用 git 忽略配置文件，可自行修改。

- package.json

    项目描述文件，可自行修改（一般情况下只需要修改 name & version 即可，多项目下需要注意传递项目名）。

- tsconfig.json

    TypeScript 配置文件，一般情况下按需修改。

- tsup.config.ts

    Tsup 配置文件，一般情况下单项目不需要修改。
