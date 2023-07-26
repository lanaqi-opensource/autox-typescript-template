# Autox TypeScript Template

基于 VsCode 开发 TypeScript 工程化的 Autox 模板。

## 工程结构

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

## 使用步骤

1. 复制工程目录所有到你的项目中。
2. 打开 VsCode 开启服务并监听 ADB 设备。
3. 使用 Autox.js 连接 VsCode 监听。
4. 运行项目中 scripts 即可。
5. 使用资源文件时，需先部署，否则无法读取（可以修改 DEPLOY_ACTION 为 both 值）。

## 编码方式

应遵守以下代码编写方式。

### 导入模块方式

``` js

// 不要这样
var circle = require('circle.js');
console.log("半径为 4 的圆的面积是 %d", circle.area(4));

// 应该这样（这个 circle.js 应遵守 es5+ 标准）
import circle from './circle';
console.log("半径为 4 的圆的面积是 %d", circle.area(4));

```

### 导入静态资源

建议把这一类放置 src/static 目录下。

``` ts

// 支持后缀：jpg / jpeg / ico / gif / svg / svgz / webp / png / bmp
import png from './my.png';

// 同时也支持对 .md / .txt / .text 文件读取为文本字符串
import txt from './test.txt';

```

### 编写 UI 方式

``` jsx

// 在原始 js 中使用 ui 时，必须先在 main.js 的顶部 "ui"; 声明。
// 在这里不必声明，会自动注入，当使用 ui. 时注入。

// 不要这样
ui.layout(
    <vertical>
        <button text="第一个按钮"/>
        <button text="第二个按钮"/>
    </vertical>
);

// 静态模板（如果可以还是使用静态模板比较好）
// 建议放到 html 目录下（该目录受监控变动处理）
import mainHtml from './html/main.html';
import png from './my.png';
ui.layout(mainHtml);
// 动态修改属性
const myImg = ui.findView('id');
myImg.attr('src', `data:image/png;base64,${png}`);

// 动态模板
// 应该这样，更多参考：https://github.com/zspecza/common-tags
import { html } from 'common-tags';
import png from './my.png';

ui.layout(html`
    <vertical>
        <button text="第一个按钮"/>
        <button text="第二个按钮"/>
        <img src="data:image/png;base64,${png}" />
    </vertical>
`);

```

### 不推荐编码

``` ts

// 尽量不要用 require 函数（某些情况下也需要该方式，如导入第三方库）
require('./test.txt');

```
