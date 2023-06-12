/// <reference path="./images.d.ts" />

declare namespace paddle {

    function ocr(img: Image, cpuThreadNum?: number, useSlim?: boolean): string[];

    function ocrText(img: Image, cpuThreadNum?: number, useSlim?: boolean): string[];

    function release(): void;

}

declare namespace gmlkit {

    function ocr(img: Image, language: string): object;

}
