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

## 使用步骤说明

1. 复制工程目录所有到你的项目中。
2. 打开 VsCode 开启服务并监听 ADB 设备。
3. 使用 Autox.js 连接 VsCode 监听。
4. 运行项目中 scripts 即可。
5. 使用资源文件时，需先部署，否则无法读取（可以修改 DEPLOY_ACTION 为 both 值）。

## 不支持功能

暂时不支持以下代码编写方式。

``` js

// 以下代码时不支持的
var circle = require('circle.js');
console.log("半径为 4 的圆的面积是 %d", circle.area(4));

// 这个 require 使用 import 来替代。
import circle from './index';
console.log("半径为 4 的圆的面积是 %d", circle.area(4));

```

``` jsx

// 在原始js中使用 ui 时，必须先在 main.js 的顶部使用 "ui"; 声明
// 但在 ts 中可以忽略编写或在非顶部使用 "ui"; 声明

// 以下代码时不支持的
"ui";
ui.layout(
    <vertical>
        <button text="第一个按钮"/>
        <button text="第二个按钮"/>
    </vertical>
);

// 使用 x.xml 替换
// a.xml
<vertical>
        <button text="第一个按钮"/>
        <button text="第二个按钮"/>
</vertical>

// 在 main.ts 中以下编写都是可以编译以及运行的
ui.layout(require('./main.xml'));

// 或者手动添加 "ui"; 声明
"ui";
ui.layout(require('./main.xml'));

// 注意导入文件必须是 require('./main.xml') 方式编码。

// ps: 对于图片类型可以编译为 base64 然后使用 images.fromBase64(require('./my.png')) 方式读取。
// 支持后缀：jpg / jpeg / ico / gif / svg / svgz / webp / png / bmp
// 注意：加载图片与资源并非是一类的。
// 建议把这一类放置 src/statics 目录下。

```
